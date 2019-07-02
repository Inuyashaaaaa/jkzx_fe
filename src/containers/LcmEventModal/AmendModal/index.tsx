import { Modal, message, Alert, InputNumber, Checkbox } from 'antd';
import _ from 'lodash';
import React, { memo, useState, useRef, useEffect } from 'react';
import moment from 'moment';
import FormItem from 'antd/lib/form/FormItem';
import { LCM_EVENT_TYPE_MAP, LEG_FIELD, LEG_ID_FIELD, DATE_ARRAY } from '@/constants/common';
import { LEG_ENV } from '@/constants/legs';
import MultiLegTable from '@/containers/MultiLegTable';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { convertLegDataByEnv, getLegByRecord } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { convertTradePositions } from '@/services/pages';
import { Form2, DatePicker } from '@/containers';
import { ITableData } from '@/components/type';
import { IMultiLegTableEl } from '@/containers/MultiLegTable/type';
import CashExportModal from '@/containers/CashExportModal';

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

const AmendModal = memo<IAmendModal>(props => {
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
  const [store, setStore] = useState<{
    record?: any;
    tableFormData?: any;
    currentUser?: any;
    reload?: any;
  }>({});
  current({
    show: (record, tableFormData, currentUser, reload) => {
      const newData = _.mapValues(record, (item, key) => {
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
        cashFlowChange: {
          ...cashFlowChange,
          errors: undefined,
        },
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
        title="修改交易要素"
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
          newData.cashFlowChange = JSON.stringify(newData.cashFlowChange);
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

          if (createCash) {
            setTradeData({
              ...data,
              counterPartyCode: store.tableFormData.counterPartyCode,
            });
            setCashModalVisible(true);
            setVisible(false);
            return;
          }
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
});

export default AmendModal;
