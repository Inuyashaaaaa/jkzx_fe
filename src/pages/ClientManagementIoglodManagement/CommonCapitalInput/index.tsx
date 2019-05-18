import Form from '@/components/Form';
import ModalButton from '@/components/ModalButton';
import { clientNewTrade, clientSettleTrade } from '@/services/client-service';
import {
  clientChangeCredit,
  clientSaveAccountOpRecord,
  clientTradeCashFlow,
  cliMmarkTradeTaskProcessed,
} from '@/services/reference-data-service';
import { message, Tabs } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { isMoment } from 'moment';
import React, { PureComponent } from 'react';
import { OUR_CREATE_FORM_CONTROLS, TOOUR_CREATE_FORM_CONTROLS } from './constants';

const TabPane = Tabs.TabPane;

class CommonCapitalInput extends PureComponent<{ record?: any; type?: string; fetchTable: any }> {
  public $ourForm: WrappedFormUtils = null;

  public $toOurForm: WrappedFormUtils = null;

  public state = {
    visible: false,
    confirmLoading: false,
    activeKey: 'our',
    ourDataSource: {},
    toOurDataSource: {},
    margin: true,
    premium: true,
    cash: false,
  };

  public switchModal = () => {
    const values = this.props.record.data;
    const ourDataSource = {
      legalName: values.legalName,
      tradeId: values.tradeId,
      cashFlow: values.cashFlow,
    };
    const toOurDataSource = {
      legalName: values.legalName,
      tradeId: values.tradeId,
      counterPartyFundChange: values.cashFlow,
      counterPartyCreditBalanceChange: 0,
      counterPartyCreditChange: 0,
      counterPartyMarginChange: 0,
    };
    this.setState({
      visible: true,
      ourDataSource,
      toOurDataSource,
    });
  };

  public onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  public handConfirm = async () => {
    this.setState({
      visible: false,
      confirmLoading: true,
    });

    if (this.state.activeKey === 'our') {
      return this.createOur();
    } else {
      return this.createToOur();
    }
  };

  public onChangeTabs = activeKey => {
    this.setState({
      activeKey,
    });
  };

  public handleChangeValueOur = params => {
    const values = params.values;
    if (values.cashType === '保证金释放' || values.cashType === '保证金冻结') {
      this.setState({
        item: false,
        margin: false,
        premium: false,
        cash: true,
        ourDataSource: values,
      });
      return;
    }
    if (
      values.cashType === '平仓金额收入' ||
      values.cashType === '平仓金额扣除' ||
      values.cashType === '结算金额收入' ||
      values.cashType === '结算金额扣除'
    ) {
      this.setState({
        margin: true,
        premium: true,
        cash: true,
        ourDataSource: {
          ...values,
          tradeId: this.props.record.data.tradeId,
          premium: this.props.record.data.premium,
          cashFlow: this.props.record.data.cashFlow,
        },
      });
      return;
    }

    if (values.cashType === '期权费收入' || values.cashType === '期权费扣除') {
      this.setState({
        margin: true,
        premium: true,
        cash: false,
        ourDataSource: {
          ...values,
          tradeId: this.props.record.data.tradeId,
          premium: this.props.record.data.premium,
          cashFlow: this.props.record.data.cashFlow,
        },
      });
      return;
    }

    if (values.cashType === '授信扣除' || values.cashType === '授信恢复') {
      this.setState({
        margin: true,
        premium: false,
        cash: true,
        ourDataSource: {
          ...values,
          tradeId: this.props.record.data.tradeId,
          premium: this.props.record.data.premium,
          cashFlow: this.props.record.data.cashFlow,
        },
      });
      return;
    }

    this.setState({
      margin: true,
      premium: true,
      cash: false,
      ourDataSource: values,
    });
  };

  public handleChangeValueToOur = params => {
    const values = params.values;
    this.setState({
      toOurDataSource: values,
    });
  };

  public createOur = () => {
    const values = this.state.ourDataSource;
    switch (values.cashType) {
      case '期权费扣除':
        values.premium = new BigNumber(values.premium).negated().toNumber();
      case '期权费收入':
        return this.handlePremium(values, this.props.record.data.accountId);
      case '授信扣除':
        values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
      case '授信恢复':
        return this.handleCredit(values, this.props.record.data.accountId);
      case '平仓金额扣除':
        values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
        return this.handleEvent(values, this.props.record.data.accountId, 'UNWIND_TRADE');
      case '平仓金额收入':
        values.premium = new BigNumber(values.premium).negated().toNumber();
        return this.handleEvent(values, this.props.record.data.accountId, 'UNWIND_TRADE');
      case '结算金额扣除':
        values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
        return this.handleEvent(values, this.props.record.data.accountId, 'SETTLE_TRADE');
      case '结算金额收入':
        values.premium = new BigNumber(values.premium).negated().toNumber();
        return this.handleEvent(values, this.props.record.data.accountId, 'SETTLE_TRADE');
      case '保证金释放':
        values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
      case '保证金冻结':
        return this.handleMargin(values, this.props.record.data.accountId);
      default:
        break;
    }
  };

  public handlePremium = async (values, accountId) => {
    const clientTradeCashFlowRsp = await clientNewTrade({
      accountId,
      tradeId: values.tradeId,
      premium: values.premium,
      information: '',
    });
    this.setState({ confirmLoading: false });
    if (clientTradeCashFlowRsp.error) {
      return false;
    }
    if (!clientTradeCashFlowRsp.data.status) {
      message.error(clientTradeCashFlowRsp.data.information);
      return false;
    }
    const cliMmarkTradeTaskProcessedRsp = await cliMmarkTradeTaskProcessed({
      uuidList: [this.props.record.data.uuid],
    });
    if (cliMmarkTradeTaskProcessedRsp.error) {
      return false;
    }

    this.props.fetchTable();
    message.success('录入成功');
  };

  public handleCredit = async (values, accountId) => {
    const clientChangeCreditRsp = await clientChangeCredit({
      accountId,
      amount: String(values.cashFlow),
      information: '',
    });
    this.setState({ confirmLoading: false });
    if (clientChangeCreditRsp.error) {
      return false;
    }
    if (!clientChangeCreditRsp.data.status) {
      message.error(clientChangeCreditRsp.data.information);
      return false;
    }
    const cliMmarkTradeTaskProcessedRsp = await cliMmarkTradeTaskProcessed({
      uuidList: [this.props.record.data.uuid],
    });
    if (cliMmarkTradeTaskProcessedRsp.error) {
      return false;
    }

    this.props.fetchTable();
    message.success('录入成功');
  };

  public handleMargin = async (values, accountId) => {
    const clientTradeCashFlowRsp = await clientTradeCashFlow({
      accountId,
      tradeId: values.tradeId,
      cashFlow: String(0),
      marginFlow: String(values.cashFlow),
    });
    this.setState({ confirmLoading: false });
    if (clientTradeCashFlowRsp.error) {
      return false;
    }
    if (!clientTradeCashFlowRsp.data.status) {
      message.error(clientTradeCashFlowRsp.data.information);
      return false;
    }
    const cliMmarkTradeTaskProcessedRsp = await cliMmarkTradeTaskProcessed({
      uuidList: [this.props.record.data.uuid],
    });
    if (cliMmarkTradeTaskProcessedRsp.error) {
      return false;
    }

    this.props.fetchTable();
    message.success('录入成功');
  };

  public handleEvent = async (values, accountId, type) => {
    const { error, data } = await clientSettleTrade({
      accountId,
      amount: values.cashFlow,
      accountEvent: type,
      premium: values.premium,
      information: '',
      tradeId: values.tradeId,
    });

    if (error) return;
    if (!data.status) {
      message.error(data.information);
      return;
    }
    const cliMmarkTradeTaskProcessedRsp = await cliMmarkTradeTaskProcessed({
      uuidList: [this.props.record.data.uuid],
    });
    if (cliMmarkTradeTaskProcessedRsp.error) {
      return false;
    }
    this.props.fetchTable();
    message.success('录入成功');
  };

  public createToOur = async () => {
    const formatValues = this.state.toOurDataSource;

    const distValues = {
      ...formatValues,
      accountId: this.props.record.data.accountId,
      event: 'COUNTER_PARTY_CHANGE',
      uuid: '',
      marginChange: '',
      cashChange: '',
      premiumChange: '',
      creditUsedChange: '',
      debtChange: '',
      netDepositChange: '',
      realizedPnLChange: '',
      creditChange: '',
    };

    const clientSaveAccountOpRecordRsp = await clientSaveAccountOpRecord({
      accountOpRecord: distValues,
    });
    this.setState({ confirmLoading: false });
    if (clientSaveAccountOpRecordRsp.error) return false;
    if (this.props.type === 'history') {
      const cliMmarkTradeTaskProcessedRsp = await cliMmarkTradeTaskProcessed({
        uuidList: [this.props.record.data.uuid],
      });

      if (cliMmarkTradeTaskProcessedRsp.error) {
        return false;
      }
    }

    this.props.fetchTable();
    message.success('录入成功');
  };

  public render() {
    return (
      <ModalButton
        key="import"
        type="primary"
        size="small"
        onClick={this.switchModal}
        modalProps={{
          visible: this.state.visible,
          confirmLoading: this.state.confirmLoading,
          onCancel: this.onCancel,
          onOk: this.handConfirm,
        }}
        content={
          <Tabs activeKey={this.state.activeKey} onChange={this.onChangeTabs}>
            <TabPane tab="客户资金变动" key="our">
              <Form
                wrappedComponentRef={element => {
                  if (element) {
                    this.$ourForm = element.props.form;
                  }
                  return;
                }}
                dataSource={this.state.ourDataSource}
                controls={OUR_CREATE_FORM_CONTROLS(
                  this.state.margin,
                  this.state.premium,
                  this.state.cash
                )}
                onValueChange={this.handleChangeValueOur}
                controlNumberOneRow={1}
                footer={false}
              />
            </TabPane>
            <TabPane tab="我方资金变动" key="toOur">
              <Form
                wrappedComponentRef={element => {
                  if (element) {
                    this.$toOurForm = element.props.form;
                  }
                  return;
                }}
                dataSource={this.state.toOurDataSource}
                controls={TOOUR_CREATE_FORM_CONTROLS}
                onValueChange={this.handleChangeValueToOur}
                controlNumberOneRow={1}
                footer={false}
              />
            </TabPane>
          </Tabs>
        }
      >
        资金录入
      </ModalButton>
    );
  }
}

export default CommonCapitalInput;
