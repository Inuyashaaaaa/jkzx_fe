import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/design/components/Form';
import ModalButton from '@/design/components/ModalButton';
import { clientNewTrade, clientSettleTrade } from '@/services/client-service';
import {
  clientAccountGetByLegalName,
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

class CapitalInputModal extends PureComponent<{ record?: any; type?: string; fetchTable: any }> {
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
    const ourDataSource = {
      cashFlow: 0,
    };
    const toOurDataSource = {
      counterPartyFundChange: 0,
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
        ourDataSource: values,
      });
      return;
    }

    if (values.cashType === '期权费收入' || values.cashType === '期权费扣除') {
      this.setState({
        margin: true,
        premium: true,
        cash: false,
        ourDataSource: values,
      });
      return;
    }

    if (values.cashType === '授信扣除' || values.cashType === '授信恢复') {
      this.setState({
        margin: true,
        premium: false,
        cash: true,
        ourDataSource: values,
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

  public createOur = async () => {
    const values = this.state.ourDataSource;
    const { error, data } = await clientAccountGetByLegalName({
      legalName: values.legalName,
    });
    switch (values.cashType) {
      case '期权费扣除':
        values.premium = new BigNumber(values.premium).negated().toNumber();
      case '期权费收入':
        return this.handlePremium(values, data.accountId);
      case '授信扣除':
        values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
      case '授信恢复':
        return this.handleCredit(values, data.accountId);
      case '平仓金额扣除':
        values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
        return this.handleEvent(values, data.accountId, 'UNWIND_TRADE');
      case '平仓金额收入':
        values.premium = new BigNumber(values.premium).negated().toNumber();
        return this.handleEvent(values, data.accountId, 'UNWIND_TRADE');
      case '结算金额扣除':
        values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
        return this.handleEvent(values, data.accountId, 'SETTLE_TRADE');
      case '结算金额收入':
        values.premium = new BigNumber(values.premium).negated().toNumber();
        return this.handleEvent(values, data.accountId, 'SETTLE_TRADE');
      case '保证金释放':
        values.cashFlow = new BigNumber(values.cashFlow).negated().toNumber();
      case '保证金冻结':
        return this.handleMargin(values, data.accountId);
      default:
        break;
    }
  };

  public handlePremium = async (values, accountId) => {
    const { error, data } = await clientNewTrade({
      accountId,
      tradeId: values.tradeId,
      premium: values.premium,
      information: '',
    });
    this.setState({ confirmLoading: false });
    if (error) {
      return false;
    }
    if (!data.status) {
      message.error(data.information);
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
    this.props.fetchTable();
    message.success('录入成功');
  };

  public createToOur = async () => {
    const formatValues = this.state.toOurDataSource;
    const { error, data } = await clientAccountGetByLegalName({
      legalName: formatValues.legalName,
    });
    const distValues = {
      ...formatValues,
      accountId: data.accountId,
      event: 'START_TRADE',
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
    this.props.fetchTable();
    message.success('录入成功');
  };

  public render() {
    return (
      <ModalButton
        key="import"
        type="primary"
        onClick={this.switchModal}
        modalProps={{
          visible: this.state.visible,
          confirmLoading: this.state.confirmLoading,
          onCancel: this.onCancel,
          onOk: this.handConfirm,
        }}
        style={{ marginBottom: VERTICAL_GUTTER }}
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

export default CapitalInputModal;
