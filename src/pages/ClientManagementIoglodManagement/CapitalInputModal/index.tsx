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
  trdTradeIdListByCounterPartyName,
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
  const [tradeIds, setTradeIds] = useState([]);

  const handleConfirm = async () => {
    const rsp = await Promise.all([
      formEl.current.validate(),
      formTrade.current.validate(),
      partyForm.current.validate(),
      counterPartyForm.current.validate(),
    ]);
    if (rsp.some(item => item.error)) return;
    handlePageData2apiData();
  };

  const handlePageData2apiData = async () => {
    setConfirmLoading(true);
    const fundType = Form2.getFieldsValue(tradeFormData).event;
    const partyData = Form2.getFieldsValue(partyFormData);
    const counterPartyData = Form2.getFieldsValue(counterPartyFormData);
    const { error: _error, data: _data } = await clientAccountGetByLegalName({
      legalName: Form2.getFieldsValue(legalFormData).legalName,
    });

    setConfirmLoading(false);
    if (_error) return;

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
        use: '-',
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

    const { error: _error, data: _data } = await clientAccountGetByLegalName({
      legalName: allFields.legalName.value,
    });

    if (_error) {
      return;
    }

    _data.use = (_data.credit - _data.creditUsed).toFixed(4);
    setTableDataSource([_data]);
    setLegalFormData(
      Form2.createFields({
        legalName: allFields.legalName.value,
        normalStatus: _data.normalStatus ? '正常' : '异常',
      })
    );
  };

  const legalFormValueChange = async (props, changedValues, allValues) => {
    if (changedValues.legalName) {
      setTradeIds([]);
    }
    const { error, data } = await trdTradeIdListByCounterPartyName({
      counterPartyName: changedValues.legalName,
    });
    if (error) return;
    const tradeIds = data.map(item => {
      return {
        label: item,
        value: item,
      };
    });
    setTradeIds(tradeIds);
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
          onValuesChange={legalFormValueChange}
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
          columns={MIDDLE_FORM_CONTROLS(tradeIds)}
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
