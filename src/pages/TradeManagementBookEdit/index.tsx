import {
  LEG_FIELD,
  LEG_ID_FIELD,
  LCM_EVENT_TYPE_ZHCN_MAP,
  LEG_TYPE_FIELD,
} from '@/constants/common';
import { FORM_EDITABLE_STATUS } from '@/constants/global';
import { LEG_ENV } from '@/constants/legs';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import { Form2, Loading } from '@/design/components';
import { ITableData } from '@/design/components/type';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { trdTradeGet } from '@/services/general-service';
import {
  backConvertPercent,
  createLegDataSourceItem,
  getTradeCreateModalData,
} from '@/services/pages';
import { trdPositionLCMEventTypes, trdTradeLCMUnwindAmountGet } from '@/services/trade-service';
import { getLegByProductType, getLegByRecord } from '@/tools';
import { ILeg } from '@/types/leg';
import { Divider, message, Typography, Menu } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import ActionBar from './ActionBar';
import './index.less';
import LcmEventModal, { ILcmEventModalEl } from '@/containers/LcmEventModal';

const TradeManagementBooking = props => {
  const { currentUser } = props;
  const { tradeManagementBookEditPageData, dispatch } = props;
  const { tableData } = tradeManagementBookEditPageData;
  const setTableData = payload => {
    dispatch({
      type: 'tradeManagementBookEdit/setTableData',
      payload,
    });
  };

  const [tableLoading, setTableLoading] = useState(false);
  const [createFormData, setCreateFormData] = useState({});
  const tableEl = useRef<IMultiLegTableEl>(null);
  const [eventTypes, setEventTypes] = useState({});

  const addLeg = (leg: ILeg, position) => {
    if (!leg) return;

    const isAnnualized = position.asset.annualized;

    setTableData(pre => {
      const next = {
        ...createLegDataSourceItem(leg, LEG_ENV.EDITING),
        [LEG_ID_FIELD]: position.positionId,
        [LEG_FIELD.POSITION_ID]: Form2.createField(position.positionId),
        [LEG_FIELD.LCM_EVENT_TYPE]: Form2.createField(position.lcmEventType),
        ...Form2.createFields(
          backConvertPercent({
            ..._.omitBy(
              _.omit(position.asset, ['counterpartyCode', 'annualized', 'exerciseType']),
              _.isNull
            ),
            [LEG_FIELD.IS_ANNUAL]: isAnnualized,
          })
        ),
        ...leg.getPageData(LEG_ENV.EDITING, position),
      };
      return pre.concat(next);
    });
  };

  const loadTableData = async () => {
    setTableData([]);
    setCreateFormData([]);

    if (!props.location.query.id) {
      return message.warn('查看 id 不存在');
    }

    setTableLoading(true);

    const { error, data } = await trdTradeGet({
      tradeId: props.location.query.id,
    });

    if (error) return;

    const tableFormData = getTradeCreateModalData(data);

    const { positions } = data;

    const composePositions = await Promise.all(
      positions.map(position => {
        return trdTradeLCMUnwindAmountGet({
          tradeId: tableFormData.tradeId,
          positionId: position.positionId,
        }).then(rsp => {
          const { error, data } = rsp;
          if (error) return position;
          return {
            ...position,
            asset: {
              ...position.asset,
              [LEG_FIELD.INITIAL_NOTIONAL_AMOUNT]: data.initialValue,
              [LEG_FIELD.ALUNWIND_NOTIONAL_AMOUNT]: data.historyValue,
            },
          };
        });
      })
    );

    setTableLoading(false);
    setCreateFormData(Form2.createFields(tableFormData));
    mockAddLegItem(composePositions, tableFormData);
    fetchEventType(composePositions);
  };

  const mockAddLegItem = async (composePositions, tableFormData) => {
    composePositions.forEach(position => {
      const leg = getLegByProductType(position.productType, position.asset.exerciseType);
      addLeg(leg, position);
    });
  };

  const fetchEventType = composePositions => {
    composePositions.forEach(position => {
      trdPositionLCMEventTypes({
        positionId: position.positionId,
      }).then(rsp => {
        if (rsp.error) return;
        const data = [...rsp.data];
        setEventTypes(pre => ({
          ...pre,
          [position.positionId]: data,
        }));
      });
    });
  };

  const getContextMenu = params => {
    const menuItem =
      eventTypes[params.record.id] &&
      eventTypes[params.record.id].map(eventType => {
        return { key: eventType, value: LCM_EVENT_TYPE_ZHCN_MAP[eventType] };
      });
    if (!menuItem) return;
    return (
      <Menu onClick={({ key }) => handleEventAction(key, params)}>
        {menuItem.map(item => {
          return <Menu.Item key={item.key}>{item.value}</Menu.Item>;
        })}
      </Menu>
    );
  };

  const handleEventAction = (eventType, params) => {
    lcmEventModalEl.current.show({
      eventType,
      record: params.record,
      createFormData,
      currentUser,
      loadData: loadTableData,
    });
  };

  useLifecycles(() => {
    loadTableData();
  });

  const lcmEventModalEl = useRef<ILcmEventModalEl>(null);

  return (
    <PageHeaderWrapper>
      <Typography.Title level={4}>基本信息</Typography.Title>
      <Divider />
      <Loading loading={tableLoading}>
        <BookingBaseInfoForm
          columnNumberOneRow={2}
          editableStatus={FORM_EDITABLE_STATUS.SHOW}
          createFormData={createFormData}
          setCreateFormData={setCreateFormData}
        />
      </Loading>
      <Typography.Title style={{ marginTop: 20 }} level={4}>
        交易结构信息
      </Typography.Title>
      <Divider />
      <MultiLegTable
        env={LEG_ENV.EDITING}
        loading={tableLoading}
        tableEl={tableEl}
        onCellFieldsChange={params => {
          const { record } = params;
          const leg = getLegByRecord(record);

          setTableData(pre => {
            const newData = pre.map(item => {
              if (item[LEG_ID_FIELD] === params.rowId) {
                return {
                  ...item,
                  ...params.changedFields,
                };
              }
              return item;
            });
            if (leg.onDataChange) {
              leg.onDataChange(
                LEG_ENV.EDITING,
                params,
                newData[params.rowIndex],
                newData,
                (colId: string, loading: boolean) => {
                  tableEl.current.setLoadings(params.rowId, colId, loading);
                },
                tableEl.current.setLoadingsByRow,
                (colId: string, newVal: ITableData) => {
                  setTableData(pre =>
                    pre.map(item => {
                      if (item[LEG_ID_FIELD] === params.rowId) {
                        return {
                          ...item,
                          [colId]: newVal,
                        };
                      }
                      return item;
                    })
                  );
                },
                setTableData
              );
            }
            return newData;
          });
        }}
        dataSource={tableData}
        getContextMenu={getContextMenu}
      />
      <LcmEventModal current={node => (lcmEventModalEl.current = node)} />
      <ActionBar />
    </PageHeaderWrapper>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    tradeManagementBookEditPageData: state.tradeManagementBookEdit,
  }))(TradeManagementBooking)
);
