import { LEG_FIELD, LEG_ID_FIELD, LEG_TYPE_FIELD, LEG_TYPE_ZHCH_MAP } from '@/constants/common';
import { FORM_EDITABLE_STATUS } from '@/constants/global';
import { LEG_FIELD_ORDERS } from '@/constants/legColDefs/common/order';
import { LEG_ENV, TOTAL_LEGS } from '@/constants/legs';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import { Form2, Loading, Table2 } from '@/design/components';
import { ITableData } from '@/design/components/type';
import { remove } from '@/design/utils';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { trdTradeGet } from '@/services/general-service';
import {
  backConvertPercent,
  createLegDataSourceItem,
  getTradeCreateModalData,
} from '@/services/pages';
import { trdPositionLCMEventTypes, trdTradeLCMUnwindAmountGet } from '@/services/trade-service';
import { getLegByRecord } from '@/tools';
import { ILeg, ILegColDef } from '@/types/leg';
import { Affix, Button, Divider, message, Row, Typography } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import './index.less';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';

const TradeManagementBooking = props => {
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const [createFormData, setCreateFormData] = useState({});
  const tableEl = useRef<IMultiLegTableEl>(null);
  const [eventTypes, setEventTypes] = useState({});

  const addLeg = (leg: ILeg, position) => {
    if (!leg) return;

    const isAnnualized = position.asset.annualized;

    setTableData(pre =>
      pre.concat({
        ...createLegDataSourceItem(leg, LEG_ENV.EDITING),
        [LEG_ID_FIELD]: position.positionId,
        lcmEventType: position.lcmEventType,
        ...leg.getPageData(LEG_ENV.EDITING, position),
        ...Form2.createFields(
          backConvertPercent({
            ..._.omitBy(
              _.omit(position.asset, ['counterpartyCode', 'annualized', 'exerciseType']),
              _.isNull
            ),
            [LEG_FIELD.IS_ANNUAL]: isAnnualized,
          })
        ),
      })
    );
  };

  const loadTableData = async () => {
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
      const leg = TOTAL_LEGS.find(it => it.type === position.productType);
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

  useLifecycles(() => {
    loadTableData();
  });

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
        // getContextMenu={params => {
        //   return (
        //     <Menu
        //       onClick={event => {
        //         if (event.key === 'copy') {
        //           setTableData(pre => {
        //             const next = insert(pre, params.rowIndex, {
        //               ..._.cloneDeep(params.record),
        //               [LEG_ID_FIELD]: uuid(),
        //             });
        //             return next;
        //           });
        //         }
        //         if (event.key === 'remove') {
        //           setTableData(pre => {
        //             const next = remove(pre, params.rowIndex);
        //             return next;
        //           });
        //         }
        //       }}
        //     >
        //       <Menu.Item key="copy">复制</Menu.Item>
        //       <Menu.Item key="remove">删除</Menu.Item>
        //     </Menu>
        //   );
        // }}
      />
    </PageHeaderWrapper>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    pricingData: state.pricingData,
  }))(TradeManagementBooking)
);
