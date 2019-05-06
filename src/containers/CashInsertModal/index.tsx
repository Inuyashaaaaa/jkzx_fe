import { DIRECTION_TYPE_ZHCN_MAP, LCM_EVENT_TYPE_ZHCN_MAP } from '@/constants/common';
import { Form2, Input } from '@/design/components';
import { clientChangePremium, clientSettleTrade } from '@/services/client-service';
import {
  clientAccountGetByLegalName,
  clientSaveAccountOpRecord,
  cliMmarkTradeTaskProcessed,
} from '@/services/reference-data-service';
import { Alert, Button, Card, Col, message, Modal, Row, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import {
  COUNTER_PARTY_FORM_CONTROLS,
  MIDDLE_FORM_CONTROLS,
  PARTY_FORM_CONTROLS,
  TABLE_COL_DEF,
} from './constants';

const CashInsertModal = memo<any>(props => {
  const formEl = useRef<Form2>(null);
  const formTrade = useRef<Form2>(null);
  const partyForm = useRef<Form2>(null);
  const counterPartyForm = useRef<Form2>(null);

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [legalFormData, setLegalFormData] = useState({});
  const [tableDataSource, setTableDataSource] = useState([]);
  const [tradeFormData, setTradeFormData] = useState({});
  const [partyFormData, setPartyFormData] = useState({});
  const [counterPartyFormData, setCounterPartyFormData] = useState({});

  const handleConfirm = async () => {
    const [{ error: partyError }, { error: counterError }] = await Promise.all([
      partyForm.current.validate(),
      counterPartyForm.current.validate(),
    ]);
    if (partyError || counterError) return;
    setConfirmLoading(true);
    handlePageData2apiData();
  };

  const handlePageData2apiData = async () => {
    const fundType = Form2.getFieldsValue(tradeFormData).event;
    const partyData = Form2.getFieldsValue(partyFormData);
    const counterPartyData = Form2.getFieldsValue(counterPartyFormData);
    const params = handleFundChange(fundType, partyData, counterPartyData);
    const { error, data } = await clientSaveAccountOpRecord(params);
    setConfirmLoading(false);
    if (error) {
      message.error('录入失败');
      return;
    }
    setVisible(false);
    message.success('录入成功');

    const rsp = await cliMmarkTradeTaskProcessed({
      uuidList: [props.record.uuid],
    });
    if (rsp.error) return;
    props.fetchTable();
  };

  const handleFundChange = (fundType, partyData, counterPartyData) => {
    let event;
    if (fundType.includes('CHANGE_PREMIUM')) {
      event = 'CHANGE_PREMIUM';
    } else if (fundType.includes('UNWIND_TRADE')) {
      event = 'UNWIND_TRADE';
    } else if (fundType.includes('SETTLE_TRADE')) {
      event = 'SETTLE_TRADE';
    } else {
      event = 'TRADE_CASH_FLOW';
    }

    return {
      accountOpRecord: {
        event,
        ..._.pick(props.record, ['legalName', 'tradeId', 'accountId']),
        ...Form2.getFieldsValue(partyData),
        ...Form2.getFieldsValue(counterPartyData),
      },
    };
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const switchModal = async () => {
    const { error, data } = await clientAccountGetByLegalName({
      legalName: props.record.legalName,
    });
    if (error) return;
    const fundType = handleFundEventType(props.record.direction, props.record.lcmEventType);
    getFundFormData(fundType);
    setTradeFormData(
      Form2.createFields({
        ...props.record,
        direction: DIRECTION_TYPE_ZHCN_MAP[props.record.direction],
        lcmEventType: LCM_EVENT_TYPE_ZHCN_MAP[props.record.lcmEventType],
        event: fundType,
      })
    );
    setTableDataSource([data]);
    setLegalFormData(
      Form2.createFields({ ...data, normalStatus: data.normalStatus ? '正常' : '异常' })
    );
    setVisible(true);
  };

  const getFundFormData = async fundType => {
    let rsp;
    const values = props.record;
    if (fundType.includes('CHANGE_PREMIUM')) {
      rsp = await clientChangePremium({
        accountId: values.accountId,
        tradeId: values.tradeId,
        premium: values.premium,
      });
    }
    if (fundType.includes('UNWIND_TRADE')) {
      rsp = await clientSettleTrade({
        accountId: values.accountId,
        amount: values.cashFlow,
        accountEvent: 'UNWIND_TRADE',
        premium: values.premium,
        information: '',
        tradeId: values.tradeId,
      });
    }
    if (fundType.includes('SETTLE_TRADE')) {
      rsp = await clientSettleTrade({
        accountId: values.accountId,
        amount: values.cashFlow,
        accountEvent: 'SETTLE_TRADE',
        premium: values.premium,
        information: '',
        tradeId: values.tradeId,
      });
    }
    if (rsp.error) return;
    setPartyFormData(
      Form2.createFields(
        _.pick(rsp.data, ['cashChange', 'creditBalanceChange', 'debtChange', 'premiumChange'])
      )
    );
    setCounterPartyFormData(
      Form2.createFields(
        _.pick(rsp.data, ['counterPartyFundChange', 'counterPartyCreditBalanceChange'])
      )
    );
  };

  const handleFundEventType = (direction, lcmEventType) => {
    if (direction === 'BUYER') {
      if (lcmEventType === 'OPEN') {
        return 'BUYER_CHANGE_PREMIUM';
      }
      if (lcmEventType === 'UNWIND_PARTIAL' || lcmEventType === 'UNWIND') {
        return 'BUYER_UNWIND_TRADE';
      }
      return 'BUYER_SETTLE_TRADE';
    } else {
      if (lcmEventType === 'OPEN') {
        return 'SELLER_CHANGE_PREMIUM';
      }
      if (lcmEventType === 'UNWIND_PARTIAL' || lcmEventType === 'UNWIND') {
        return 'SELLER_UNWIND_TRADE';
      }
      return 'SELLER_SETTLE_TRADE';
    }
  };

  const partyFormChange = (props, changedFields, allFields) => {
    setPartyFormData(allFields);
  };

  const counterPartyFormChange = (props, changedFields, allFields) => {
    setCounterPartyFormData(allFields);
  };

  const tableFormChange = (props, changedFields, allFields) => {
    setTradeFormData(allFields);
  };

  return (
    <>
      <Modal
        title="台账资金录入(由生命周期事件引起)"
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="录入"
        visible={visible}
        width={1000}
        confirmLoading={confirmLoading}
        destroyOnClose={true}
      >
        <Form2
          ref={node => (formEl.current = node)}
          columnNumberOneRow={3}
          footer={false}
          dataSource={legalFormData}
          columns={[
            {
              title: '交易对手',
              dataIndex: 'legalName',
              render: (value, record, index, { form, editing }) => {
                return (
                  <FormItem>
                    {form.getFieldDecorator({})(<Input type="input" editing={false} />)}
                  </FormItem>
                );
              },
            },
            {
              title: '状态',
              dataIndex: 'normalStatus',
              render: (value, record, index, { form }) => {
                return <FormItem>{form.getFieldDecorator({})(<Input editing={false} />)}</FormItem>;
              },
            },
          ]}
        />
        <Table
          rowKey="id"
          columns={TABLE_COL_DEF}
          dataSource={tableDataSource}
          pagination={false}
          size="middle"
        />
        <Form2
          ref={node => (formTrade.current = node)}
          footer={false}
          columnNumberOneRow={3}
          dataSource={tradeFormData}
          columns={MIDDLE_FORM_CONTROLS}
          onFieldsChange={tableFormChange}
        />
        <Row type="flex" justify="space-around">
          <Col>
            <Card
              title="客户资金变化"
              style={{ width: '440px' }}
              headStyle={{ textAlign: 'center' }}
            >
              <Form2
                columns={PARTY_FORM_CONTROLS}
                ref={node => (partyForm.current = node)}
                footer={false}
                dataSource={partyFormData}
                onFieldsChange={partyFormChange}
              />
            </Card>
          </Col>
          <Col>
            <Card
              title="我方资金变化"
              style={{ width: '440px' }}
              headStyle={{ textAlign: 'center' }}
            >
              <Form2
                columns={COUNTER_PARTY_FORM_CONTROLS}
                ref={node => (counterPartyForm.current = node)}
                footer={false}
                dataSource={counterPartyFormData}
                onFieldsChange={counterPartyFormChange}
              />
            </Card>
          </Col>
        </Row>
        {/* <Alert
          message="注意: 负债一栏输入正数代表降低负债，输入负数代表增加负债"
          type="info"
          style={{ width: '720px' }}
        /> */}
      </Modal>
      <Button type="primary" onClick={switchModal} size="small">
        资金录入
      </Button>
    </>
  );
});

export default CashInsertModal;
