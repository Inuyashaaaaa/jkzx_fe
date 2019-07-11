import { Modal, message, Alert, InputNumber, Checkbox } from 'antd';
import _ from 'lodash';
import React, { memo, useState, useRef, useEffect } from 'react';
import moment from 'moment';
import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'dva';
import BigNumber from 'bignumber.js';
import {
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
  LEG_ID_FIELD,
  DATE_ARRAY,
  LEG_TYPE_MAP,
  BIG_NUMBER_CONFIG,
  PREMIUM_TYPE_MAP,
} from '@/constants/common';
import { LEG_ENV } from '@/constants/legs';
import MultiLegTable from '@/containers/MultiLegTable';
import {
  trdTradeLCMEventProcess,
  trdPositionLCMEventTypes,
  trdTradeLCMUnwindAmountGet,
} from '@/services/trade-service';
import { convertLegDataByEnv, getLegByRecord } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { convertTradePositions } from '@/services/pages';
import { Form2, DatePicker } from '@/containers';
import { ITableData } from '@/components/type';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import CashExportModal from '@/containers/CashExportModal';
import { mktInstrumentInfo } from '@/services/market-data-service';

/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable prefer-rest-params */
const UN_EDITDIR = [
  LEG_FIELD.UNDERLYER_MULTIPLIER,
  // LEG_FIELD.TERM,
  // LEG_FIELD.EFFECTIVE_DATE,
  // LEG_FIELD.EXPIRATION_DATE,
  // LEG_FIELD.NOTIONAL_AMOUNT_TYPE,
  // LEG_FIELD.NOTIONAL_AMOUNT,
  LEG_FIELD.UNIT,
  // LEG_FIELD.ALREADY_BARRIER,
];

export interface IAmendModalEl {
  show: (record, tableFormData, currentUser, reload) => void;
}

export interface IAmendModal {
  current: (node: IAmendModalEl) => void;
}

const AmendModal = props => {
  const { current } = props;

  const [visible, setVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const $form = useRef<Form2>(null);
  const [cashData, setCashData] = useState({
    ...Form2.createFields({
      paymentDate: moment(),
    }),
  });
  const [createCash, setCreateCash] = useState(false);
  const [cashModalVisible, setCashModalVisible] = useState(false);
  const [tradeData, setTradeData] = useState({});
  const [positionId, setPositionId] = useState(null);
  const [oldPremium, setOldPremium] = useState(null);

  const handleTradeNumber = position => {
    const record = Form2.getFieldsValue(position);
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

  const [store, setStore] = useState<{
    record?: any;
    tableFormData?: any;
    currentUser?: any;
    reload?: any;
  }>({});
  current({
    show: (record, tableFormData, currentUser, reload) => {
      if (oldPremium === null) {
        setOldPremium({
          premium: _.get(record, 'premium.value'),
          premiumType: _.get(record, 'premiumType.value'),
        });
      }
      setPositionId(_.get(record, 'id'));
      const unUnitLeg = [LEG_TYPE_MAP.SPREAD_EUROPEAN, LEG_TYPE_MAP.CASH_FLOW];
      const unitPositions = await Promise.all(
        [record].map(position => {
          if (unUnitLeg.includes(record.$legType)) {
            return Promise.resolve(record);
          }
          return mktInstrumentInfo({
            instrumentId: position.$legType.includes('SPREAD_EUROPEAN')
              ? _.get(position, 'underlyerInstrumentId1.value')
              : _.get(position, `${LEG_FIELD.UNDERLYER_INSTRUMENT_ID}.value`),
          }).then(rsp => {
            const { error: _error, data: _data } = rsp;
            if (_error || _data.instrumentInfo.unit === undefined) {
              return {
                ...position,
                ...Form2.createFields({
                  [LEG_FIELD.UNIT]: '_',
                }),
              };
            }
            return {
              ...position,
              ...Form2.createFields({
                [LEG_FIELD.UNIT]: _data.instrumentInfo.unit,
              }),
            };
          });
        }),
      );

      const composePositions = await Promise.all(
        unitPositions.map(position =>
          trdTradeLCMUnwindAmountGet({
            tradeId: tableFormData.tradeId,
            positionId: position.id,
          }).then(rsp => {
            const { error: _error, data: _data } = rsp;
            if (_error) return position;
            return {
              ...position,
              ...Form2.createFields({
                [LEG_FIELD.TRADE_NUMBER]: handleTradeNumber(position),
              }),
            };
          }),
        ),
      );

      const newData = _.mapValues(composePositions[0], (item, key) => {
        if (_.includes(DATE_ARRAY, key)) {
          return {
            type: 'field',
            value: moment(item.value),
          };
        }
        return item;
      });
      setTableData([convertLegDataByEnv(newData, LEG_ENV.BOOKING)]);
      setVisible(true);
      setStore({
        record,
        tableFormData,
        currentUser,
        reload,
      });
    },
  });

  const [confirmLoading, setConfirmLoading] = useState(false);
  const tableEl = useRef<IMultiLegTableEl>(null);

  const onFormChange = async (propsData, changedFields, allFields) => {
    setCashData({
      ...cashData,
      ...changedFields,
    });
  };

  useEffect(() => {
    if ($form.current && !createCash) {
      const { cashFlowChange } = cashData;
      setCashData({
        ...cashData,
        cashFlowChange: Form2.createField(undefined),
      });
    }
  }, [createCash]);

  const handleChange = e => {
    setCreateCash(e.target.checked);
  };

  const handleCancel = () => {
    setCashModalVisible(false);
    if (store.reload) {
      store.reload();
    }
  };
  return (
    <>
      <CashExportModal visible={cashModalVisible} trade={tradeData} convertVisible={handleCancel} />
      <Modal
        okText="保存"
        visible={visible}
        title={`修改交易要素${positionId ? `(${positionId})` : ''}`}
        width={700}
        onCancel={() => setVisible(false)}
        onOk={async () => {
          if (createCash) {
            const res = await $form.current.validate();
            if (res.error) return;
          }
          const rsps = await tableEl.current.table.validate();
          if (rsps.some(item => item.errors)) {
            return;
          }
          setConfirmLoading(true);
          const [position = {}] = convertTradePositions(
            tableData.map(item => Form2.getFieldsValue(item)),
            Form2.getFieldsValue(store.tableFormData),
            LEG_ENV.BOOKING,
          );
          const newData = Form2.getFieldsValue(cashData);
          newData.cashFlowChange =
            newData.cashFlowChange === undefined ? '' : String(newData.cashFlowChange);
          newData.paymentDate = moment(newData.paymentDate).format('YYYY-MM-DD');
          const { error, data } = await trdTradeLCMEventProcess({
            positionId: store.record[LEG_ID_FIELD],
            tradeId: store.tableFormData.tradeId,
            eventType: LCM_EVENT_TYPE_MAP.AMEND,
            userLoginId: store.currentUser.username,
            eventDetail: {
              asset: _.get(position, 'asset'),
              productType: position.productType,
              ...newData,
            },
          });
          setConfirmLoading(false);
          if (error) return;

          message.success('修改交易要素成功');

          let premiumChanged = false;
          if (oldPremium) {
            premiumChanged =
              oldPremium.premiumType === PREMIUM_TYPE_MAP.PERCENT
                ? oldPremium.premium / 100 !== _.get(position, 'asset.premium') ||
                  oldPremium.premiumType !== _.get(position, 'asset.premiumType')
                : oldPremium.premium !== _.get(position, 'asset.premium') ||
                  oldPremium.premiumType !== _.get(position, 'asset.premiumType');
          }

          if (createCash || premiumChanged) {
            setTradeData({
              ...data,
              counterPartyCode: store.tableFormData.counterPartyCode,
            });
            setCashModalVisible(true);
            setVisible(false);
            return;
          }
          // 刷新合约管理列表
          props.dispatch({
            type: 'tradeManagementContractManage/modify',
            payload: true,
          });
          if (store.reload) {
            store.reload();
          }
          setVisible(false);
        }}
        confirmLoading={confirmLoading}
      >
        <MultiLegTable
          tableEl={tableEl}
          env={LEG_ENV.BOOKING}
          dataSource={tableData}
          onCellFieldsChange={params => {
            const { record } = params;
            const leg = getLegByRecord(record);

            setTableData(pre => {
              const newData = [
                {
                  ..._.get(pre, '[0]'),
                  ...params.changedFields,
                },
              ];

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
                    setTableData(preData =>
                      preData.map(item => {
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
          chainColumns={(columns: ILegColDef[]) =>
            columns.map(item => ({
              ...item,
              editable(record) {
                // 拦截字段强制不可编辑
                if (UN_EDITDIR.find(key => key === item.dataIndex)) return false;
                return typeof item.editable === 'function'
                  ? item.editable.apply(this, arguments)
                  : item.editable;
              },
            }))
          }
        />
        <Checkbox checked={createCash} onChange={handleChange} style={{ margin: '20px 0' }}>
          产生现金流
        </Checkbox>
        <Form2
          ref={node => {
            $form.current = node;
          }}
          layout="inline"
          footer={false}
          dataSource={cashData}
          wrapperCol={{ span: 20 }}
          labelCol={{ span: 4 }}
          columnNumberOneRow={2}
          onFieldsChange={onFormChange}
          style={{ marginBottom: '20px' }}
          columns={[
            {
              title: '现金流金额',
              dataIndex: 'cashFlowChange',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({
                    rules: [{ required: createCash, message: '现金流金额为必填项' }],
                  })(<InputNumber style={{ width: 200 }} editing={false} disabled={!createCash} />)}
                </FormItem>
              ),
            },
            {
              title: '支付日期',
              dataIndex: 'paymentDate',
              render: (value, record, index, { form, editing }) => (
                <FormItem>
                  {form.getFieldDecorator({
                    rules: [{ required: createCash, message: '支付日期为必填项' }],
                  })(
                    <DatePicker
                      style={{ width: 200 }}
                      editing
                      format="YYYY-MM-DD"
                      disabled={!createCash}
                    />,
                  )}
                </FormItem>
              ),
            },
          ]}
        />
        <Alert
          message="现金流金额为正时代表我方收入，金额为负时代表我方支出。"
          type="info"
          showIcon
        />
      </Modal>
    </>
  );
};

export default memo<IAmendModal>(
  connect(state => ({
    tradeManagementContractManage: state.tradeManagementContractManage,
  }))(AmendModal),
);
