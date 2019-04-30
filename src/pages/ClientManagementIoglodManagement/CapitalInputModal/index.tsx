import {
  DIRECTION_TYPE_ZHCN_MAP,
  LCM_EVENT_TYPE_ZHCN_MAP,
  RULES_REQUIRED,
} from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, Input, Select } from '@/design/components';
import { clientNewTrade, clientSettleTrade } from '@/services/client-service';
import {
  clientAccountGetByLegalName,
  clientSaveAccountOpRecord,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { Button, Card, Col, message, Modal, Row, Table } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import React, { memo, useRef, useState } from 'react';
import {
  COUNTER_PARTY_FORM_CONTROLS,
  LEGAL_FORM_CONTROLS,
  MIDDLE_FORM_CONTROLS,
  PARTY_FORM_CONTROLS,
  TABLE_COL_DEF,
} from './constants';

const ClientManagementInsert = memo<any>(props => {
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
    const rsp = await Promise.all([
      formEl.current.validate(),
      formTrade.current.validate(),
      partyForm.current.validate(),
      counterPartyForm.current.validate(),
    ]);
    if (rsp.some(item => item.error)) return;
    setConfirmLoading(true);
    handlePageData2apiData();
  };

  const handlePageData2apiData = async () => {
    const fundType = Form2.getFieldsValue(tradeFormData).event;
    const partyData = Form2.getFieldsValue(partyFormData);
    const counterPartyData = Form2.getFieldsValue(counterPartyFormData);
    const { error: _error, data: _data } = await clientAccountGetByLegalName({
      legalName: Form2.getFieldsValue(legalFormData).legalName,
    });
    if (_error) {
      setConfirmLoading(false);
      return;
    }
    const params = handleFundChange(_data.accountId, fundType, partyData, counterPartyData);
    const { error, data } = await clientSaveAccountOpRecord(params);
    setVisible(false);

    if (error) {
      message.error('录入失败');
      return;
    }
    message.success('录入成功');
    props.fetchTable();
  };

  const handleFundChange = (accountId, fundType, partyData, counterPartyData) => {
    let event;
    if (fundType.includes('START_TRADE')) {
      event = 'START_TRADE';
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
        accountId,
        tradeId: Form2.getFieldsValue(tradeFormData).tradeId,
        legalName: Form2.getFieldsValue(legalFormData).legalName,
        ...Form2.getFieldsValue(partyData),
        ...Form2.getFieldsValue(counterPartyData),
      },
    };
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const switchModal = () => {
    setTableDataSource([
      {
        margin: '-',
        cash: '-',
        credit: '-',
        debt: '-',
        counterPartyCredit: '-',
        counterPartyFund: '-',
        counterPartyMargin: '-',
      },
    ]);
    setLegalFormData(Form2.createFields({ normalStatus: '-' }));
    setCounterPartyFormData(
      Form2.createFields({
        counterPartyFundChange: 0,
        counterPartyCreditChange: 0,
        counterPartyMarginChange: 0,
      })
    );
    setPartyFormData(
      Form2.createFields({
        cashChange: 0,
        creditChange: 0,
        debtChange: 0,
        premiumChange: 0,
        marginChange: 0,
      })
    );
    setVisible(true);
  };

  const getFundFormData = async fundType => {
    let rsp;
    const values = props.record;
    if (fundType.includes('START_TRADE')) {
      rsp = await clientNewTrade({
        accountId: values.accountId,
        tradeId: values.tradeId,
        premium:
          fundType === 'BUYER_START_TRADE'
            ? values.premium
            : new BigNumber(values.premium).negated().toNumber(),
        information: '',
      });
    }
    if (fundType.includes('UNWIND_TRADE')) {
      rsp = await clientSettleTrade({
        accountId: values.accountId,
        amount: 'BUYER_UNWIND_TRADE'
          ? values.cashFlow
          : new BigNumber(values.cashFlow).negated().toNumber(),
        accountEvent: 'UNWIND_TRADE',
        premium:
          fundType === 'BUYER_UNWIND_TRADE'
            ? new BigNumber(values.premium).negated().toNumber()
            : values.premium,
        information: '',
        tradeId: values.tradeId,
      });
    }
    if (fundType.includes('SETTLE_TRADE')) {
      rsp = await clientSettleTrade({
        accountId: values.accountId,
        amount:
          fundType === 'BUYER_SETTLE_TRADE'
            ? values.cashFlow
            : new BigNumber(values.cashFlow).negated().toNumber(),
        accountEvent: 'SETTLE_TRADE',
        premium: 'BUYER_SETTLE_TRADE'
          ? new BigNumber(values.premium).negated().toNumber()
          : values.premium,
        information: '',
        tradeId: values.tradeId,
      });
    }
    if (rsp.error) return;
    setPartyFormData(
      Form2.createFields(
        _.pick(rsp.data, ['cashChange', 'creditChange', 'debtChange', 'premiumChange'])
      )
    );
    setCounterPartyFormData(
      Form2.createFields(_.pick(rsp.data, ['counterPartyFundChange', 'counterPartyCreditChange']))
    );
  };

  const handleFundEventType = (direction, lcmEventType) => {
    if (direction === 'BUYER') {
      if (lcmEventType === 'OPEN') {
        return 'BUYER_START_TRADE';
      }
      if (lcmEventType === 'UNWIND_PARTIAL' || lcmEventType === 'UNWIND') {
        return 'BUYER_UNWIND_TRADE';
      }
      return 'BUYER_SETTLE_TRADE';
    } else {
      if (lcmEventType === 'OPEN') {
        return 'SELLER_START_TRADE';
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

  const legalFormChange = async (props, changedFields, allFields) => {
    setLegalFormData(allFields);
    setConfirmLoading(true);
    const { error: _error, data: _data } = await clientAccountGetByLegalName({
      legalName: allFields.legalName.value,
    });
    if (_error) {
      setConfirmLoading(false);
      return;
    }
    setTableDataSource([_data]);
    setLegalFormData(Form2.createFields({ normalStatus: _data.normalStatus ? '正常' : '异常' }));
  };

  return (
    <>
      <Modal
        title="台账资金录入"
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
          columns={LEGAL_FORM_CONTROLS}
          onFieldsChange={legalFormChange}
        />
        <Table
          rowKey="id"
          columns={TABLE_COL_DEF}
          dataSource={tableDataSource}
          pagination={false}
          size="middle"
          style={{ marginBottom: VERTICAL_GUTTER }}
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
      </Modal>
      <Button
        type="primary"
        onClick={switchModal}
        size="default"
        style={{ marginBottom: VERTICAL_GUTTER }}
      >
        资金录入
      </Button>
    </>
  );
});

export default ClientManagementInsert;
