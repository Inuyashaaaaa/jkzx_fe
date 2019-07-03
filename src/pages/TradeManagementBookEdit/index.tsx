/*eslint-disable */
import { Divider, Menu, message, Skeleton, Typography } from 'antd';
import { connect } from 'dva';
import React, { memo, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import ActionBar from './ActionBar';
import styles from './index.less';
import {
  LCM_EVENT_TYPE_ZHCN_MAP,
  LEG_FIELD,
  LEG_ID_FIELD,
  BIG_NUMBER_CONFIG,
  LEG_TYPE_MAP,
  LEG_TYPE_FIELD,
  LCM_EVENT_TYPE_MAP,
} from '@/constants/common';
import { FORM_EDITABLE_STATUS } from '@/constants/global';
import { LEG_ENV } from '@/constants/legs';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import LcmEventModal, { ILcmEventModalEl } from '@/containers/LcmEventModal';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import { Form2, Loading } from '@/containers';
import { ITableData } from '@/components/type';
import Page from '@/containers/Page';
import { trdTradeGet } from '@/services/general-service';
import { mktInstrumentInfo } from '@/services/market-data-service';
import { getTradeCreateModalData } from '@/services/pages';
import { trdPositionLCMEventTypes, trdTradeLCMUnwindAmountGet } from '@/services/trade-service';
import { createLegRecordByPosition, getLegByProductType, getLegByRecord } from '@/tools';
import { ILeg } from '@/types/leg';

const TradeManagementBooking = props => {
  const { currentUser } = props;
  const { tradeManagementBookEditPageData, dispatch } = props;
  const { tableData } = tradeManagementBookEditPageData;
  const lcmEventModalEl = useRef<ILcmEventModalEl>(null);

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
    setTableData(pre => {
      const next = {
        ...createLegRecordByPosition(leg, position, LEG_ENV.EDITING),
        [LEG_FIELD.POSITION_ID]: Form2.createField(position.positionId),
        [LEG_FIELD.LCM_EVENT_TYPE]: Form2.createField(position.lcmEventType),
      };
      return pre.concat(next);
    });
  };

  const mockAddLegItem = async (composePositions, tableFormData) => {
    composePositions.forEach(position => {
      const leg = getLegByProductType(position.productType, position.asset.exerciseType);
      addLeg(leg, position);
    });
  };

  const handleTradeNumber = position => {
    const record = position.asset;
    const notionalAmountType = record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE];
    const multipler = record[LEG_FIELD.UNDERLYER_MULTIPLIER];
    const annualCoefficient =
      record[LEG_FIELD.IS_ANNUAL] &&
      new BigNumber(record[LEG_FIELD.TERM]).div(record[LEG_FIELD.DAYS_IN_YEAR]).toNumber();
    const notionalAmount = record[LEG_FIELD.IS_ANNUAL]
      ? new BigNumber(record[LEG_FIELD.NOTIONAL_AMOUNT]).multipliedBy(annualCoefficient).toNumber()
      : record[LEG_FIELD.NOTIONAL_AMOUNT];

    const notional =
      notionalAmountType === 'LOT'
        ? notionalAmount
        : new BigNumber(notionalAmount)
            .div(record[LEG_FIELD.INITIAL_SPOT])
            .div(multipler)
            .toNumber();
    return new BigNumber(notional)
      .multipliedBy(multipler)
      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
      .toNumber();
  };

  const fetchEventType = composePositions => {
    composePositions.forEach(position => {
      trdPositionLCMEventTypes({
        positionId: position.positionId,
      }).then(rsp => {
        if (rsp.error) return;
        const data = [...rsp.data].filter(item => item !== LCM_EVENT_TYPE_MAP.PAYMENT);
        setEventTypes(pre => ({
          ...pre,
          [position.positionId]: data,
        }));
      });
    });
  };

  const loadTableData = async () => {
    setTableData([]);
    setCreateFormData([]);

    if (!props.location.query.id) {
      message.warn('查看 id 不存在');
      return;
    }

    setTableLoading(true);

    const { error, data } = await trdTradeGet({
      tradeId: props.location.query.id,
    });

    if (error) return;

    const tableFormData = getTradeCreateModalData(data);

    const { positions } = data;
    const unitPositions = await Promise.all(
      positions.map(position => {
        if (position.productType === LEG_TYPE_MAP.SPREAD_EUROPEAN) {
          return Promise.resolve(position);
        }
        return mktInstrumentInfo({
          instrumentId: position.productType.includes('SPREAD_EUROPEAN')
            ? _.get(position.asset, 'underlyerInstrumentId1')
            : position.asset[LEG_FIELD.UNDERLYER_INSTRUMENT_ID],
        }).then(rsp => {
          const { error: _error, data: _data } = rsp;
          if (_error || _data.instrumentInfo.unit === undefined) {
            return {
              ...position,
              asset: {
                ...position.asset,
                [LEG_FIELD.UNIT]: '-',
              },
            };
          }
          return {
            ...position,
            asset: {
              ...position.asset,
              [LEG_FIELD.UNIT]: _data.instrumentInfo.unit,
            },
          };
        });
      }),
    );
    const composePositions = await Promise.all(
      unitPositions.map(position =>
        trdTradeLCMUnwindAmountGet({
          tradeId: tableFormData.tradeId,
          positionId: position.positionId,
        }).then(rsp => {
          const { error: _error, data: _data } = rsp;
          if (_error) return position;
          return {
            ...position,
            asset: {
              ...position.asset,
              [LEG_FIELD.TRADE_NUMBER]: handleTradeNumber(position),
              [LEG_FIELD.INITIAL_NOTIONAL_AMOUNT]: _data.initialValue,
              [LEG_FIELD.ALUNWIND_NOTIONAL_AMOUNT]: _data.historyValue,
            },
          };
        }),
      ),
    );

    setTableLoading(false);
    setCreateFormData(Form2.createFields(tableFormData));
    mockAddLegItem(composePositions, tableFormData);
    fetchEventType(composePositions);
  };

  const getContextMenu = params => {
    const menuItem =
      eventTypes[params.record.id] &&
      eventTypes[params.record.id]
        .map(eventType => ({
          key: eventType,
          value: LCM_EVENT_TYPE_ZHCN_MAP[eventType],
        }))
        .sort((a, b) => b.value.localeCompare(a.value));
    if (!menuItem) return;
    return (
      <Menu onClick={({ key }) => handleEventAction(key, params)}>
        {menuItem.map(item => (
          <Menu.Item key={item.key}>{item.value}</Menu.Item>
        ))}
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

  return (
    <Page back title="交易详情" footer={<ActionBar tableData={tableData} />}>
      {tableLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <>
          <Typography.Title level={4}>基本信息</Typography.Title>
          <Divider />
          <div className={styles.bookingBaseInfoFormWrapper}>
            <BookingBaseInfoForm
              hideRequiredMark
              columnNumberOneRow={3}
              editableStatus={FORM_EDITABLE_STATUS.SHOW}
              createFormData={createFormData}
              setCreateFormData={setCreateFormData}
            />
          </div>
          <Typography.Title style={{ marginTop: 40 }} level={4}>
            结构信息
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
                      setTableData(prev =>
                        prev.map(item => {
                          if (item[LEG_ID_FIELD] === params.rowId) {
                            return {
                              ...item,
                              [colId]: newVal,
                            };
                          }
                          return item;
                        }),
                      );
                    },
                    setTableData,
                  );
                }
                return newData;
              });
            }}
            dataSource={tableData}
            getContextMenu={getContextMenu}
          />
          <LcmEventModal
            current={node => {
              lcmEventModalEl.current = node;
            }}
          />
        </>
      )}
      {/* <ActionBar tableData={tableData} /> */}
    </Page>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    tradeManagementBookEditPageData: state.tradeManagementBookEdit,
  }))(TradeManagementBooking),
);
