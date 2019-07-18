/* eslint-disable import/order */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import { Button, Divider, message, Row, Skeleton, Typography } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useRef, useState } from 'react';
import useLifecycles from 'react-use/lib/useLifecycles';
import uuidv4 from 'uuid/v4';
import { LEG_FIELD, LEG_ID_FIELD, BIG_NUMBER_CONFIG, LEG_TYPE_MAP } from '@/constants/common';
import { FORM_EDITABLE_STATUS } from '@/constants/global';
import { ILegColDef, LEG_ENV, TOTAL_EDITING_FIELDS } from '@/constants/legs';
import { Form2 } from '@/containers';
import BookingBaseInfoForm from '@/containers/BookingBaseInfoForm';
import { ILcmEventModalEl } from '@/containers/LcmEventModal';
import MultiLegTable from '@/containers/MultiLegTable';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import Page from '@/containers/Page';
import { ITableData } from '@/components/type';
import { queryProcessForm, queryProcessHistoryForm } from '@/services/approval';
import { convertTradePageData2ApiData, getTradeCreateModalData } from '@/services/pages';
import { createLegRecordByPosition, getLegByProductType, getLegByRecord, getMoment } from '@/tools';
import { ILeg } from '@/types/leg';
import './index.less';
import BigNumber from 'bignumber.js';
import { trdPositionLCMEventTypes, trdTradeLCMUnwindAmountGet } from '@/services/trade-service';
import { mktInstrumentInfo } from '@/services/market-data-service';

const DATE_ARRAY = [
  LEG_FIELD.SETTLEMENT_DATE,
  LEG_FIELD.EFFECTIVE_DATE,
  LEG_FIELD.EXPIRATION_DATE,
  LEG_FIELD.DOWN_BARRIER_DATE,
  LEG_FIELD.OBSERVE_START_DAY,
  LEG_FIELD.OBSERVE_END_DAY,
];

const TradeManagementBooking = props => {
  const { currentUser } = props;
  const { tradeManagementBookEditPageData, dispatch, isCompleted } = props;
  const tableData = _.map(tradeManagementBookEditPageData.tableData, iitem =>
    _.mapValues(iitem, (item, key) => {
      if (_.includes(DATE_ARRAY, key)) {
        return {
          type: 'field',
          value: getMoment(item.value),
        };
      }
      return item;
    }),
  );
  const setTableData = payload => {
    dispatch({
      type: 'tradeManagementBookEdit/setTableData',
      payload,
    });
  };
  const useEnv = props.editable ? LEG_ENV.BOOKING : LEG_ENV.EDITING;
  let currentCreateFormRef = useRef<Form2>(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [createFormData, setCreateFormData] = useState({});
  const tableEl = useRef<IMultiLegTableEl>(null);
  const [eventTypes, setEventTypes] = useState({});
  const addLeg = (leg: ILeg, position) => {
    if (!leg) return;

    setTableData(pre => {
      const next = {
        ...createLegRecordByPosition(leg, { ...position, positionId: uuidv4() }, useEnv),
      };
      return pre.concat(next);
    });
  };

  const loadTableData = async () => {
    setTableData([]);
    setCreateFormData([]);

    if (!props.id) {
      return message.warn('查看 id 不存在');
    }

    setTableLoading(true);
    const executeMethod = isCompleted ? queryProcessHistoryForm : queryProcessForm;
    const { error, data } = await executeMethod({
      processInstanceId: props.id,
    });
    if (error) return;
    const unUnitLeg = [LEG_TYPE_MAP.SPREAD_EUROPEAN, LEG_TYPE_MAP.CASH_FLOW];
    const { positions } = _.get(data, 'process._business_payload.trade');

    const unitPositions = await Promise.all(
      (positions || []).map(position => {
        if (unUnitLeg.includes(position.productType)) {
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

    const tableFormData = {
      tradeId: _.get(data, 'process._business_payload.trade.tradeId'),
      bookName: _.get(data, 'process._business_payload.trade.bookName'),
      tradeDate: moment(_.get(data, 'process._business_payload.trade.tradeDate')),
      salesCode: _.get(data, 'process._business_payload.trade.salesCode'),
      counterPartyCode: _.get(
        data,
        'process._business_payload.trade.positions[0].counterPartyCode',
      ),
      comment: _.get(data, 'process._business_payload.trade.comment'),
    };

    const mockAddLegItem = async (composePositions, tableForm) => {
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
        ? new BigNumber(record[LEG_FIELD.NOTIONAL_AMOUNT])
            .multipliedBy(annualCoefficient)
            .toNumber()
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

    // const unitPositions = _.get(data, 'process._business_payload.trade.positions');
    const composePositions = (unitPositions || []).map(position => ({
      ...position,
      asset: {
        ...position.asset,
        [LEG_FIELD.TRADE_NUMBER]: handleTradeNumber(position),
      },
    }));
    setTableLoading(false);
    setCreateFormData(Form2.createFields(tableFormData));
    if (!composePositions) return;
    mockAddLegItem(composePositions, tableFormData);
  };

  const handelSave = async () => {
    const [formRsp, tableRsps] = await Promise.all([
      currentCreateFormRef.validate(),
      tableEl.current.table.validate(),
    ]);
    if (tableRsps.some(item => item.errors) || formRsp.error) return;
    const trade = convertTradePageData2ApiData(
      tableData.map(item => Form2.getFieldsValue(item)),
      Form2.getFieldsValue(createFormData),
      currentUser.username,
      LEG_ENV.BOOKING,
    );
    props.tbookEditCancel();
    props.confirmModify(trade);
  };

  const lcmEventModalEl = useRef<ILcmEventModalEl>(null);

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
    <>
      {tableLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <>
          <Typography.Title level={4}>基本信息</Typography.Title>
          <Divider />
          <div>
            <BookingBaseInfoForm
              currentCreateFormRef={node => {
                currentCreateFormRef = node;
              }}
              columnNumberOneRow={2}
              editableStatus={
                props.editable ? FORM_EDITABLE_STATUS.EDITING_NO_CONVERT : FORM_EDITABLE_STATUS.SHOW
              }
              createFormData={createFormData}
              setCreateFormData={setCreateFormData}
            />
          </div>
          <Typography.Title style={{ marginTop: 20 }} level={4}>
            交易结构信息
          </Typography.Title>
          <Divider />
          <MultiLegTable
            env={useEnv}
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
                  const _LEG_ENV = useEnv;
                  leg.onDataChange(
                    _LEG_ENV,
                    params,
                    newData[params.rowIndex],
                    newData,
                    (colId: string, loading: boolean) => {
                      tableEl.current.setLoadings(params.rowId, colId, loading);
                    },
                    tableEl.current.setLoadingsByRow,
                    (colId: string, newVal: ITableData) => {
                      setTableData(p =>
                        p.map(item => {
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
            chainColumns={(columns: ILegColDef[]) => {
              const totalFields = TOTAL_EDITING_FIELDS.map(item => item.dataIndex);
              return columns.filter(item => !totalFields.includes(item.dataIndex));
            }}
          />
        </>
      )}
      {props.editable ? (
        <Row
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '25px',
          }}
        >
          <Button type="primary" onClick={handelSave}>
            保存
          </Button>
          <Button style={{ marginLeft: '20px' }} onClick={() => props.tbookEditCancel()}>
            取消
          </Button>
        </Row>
      ) : null}
    </>
  );
};

export default memo(
  connect(state => ({
    currentUser: (state.user as any).currentUser,
    tradeManagementBookEditPageData: state.tradeManagementBookEdit,
  }))(TradeManagementBooking),
);
