import {
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  LEG_TYPE_MAP,
  LEG_TYPE_FIELD,
} from '@/constants/common';
import CashExportModal from '@/containers/CashExportModal';
import Form from '@/containers/Form';
import { tradeExercisePreSettle, trdTradeLCMEventProcess } from '@/services/trade-service';
import { Alert, message, Modal } from 'antd';
import BigNumber from 'bignumber.js';
import React, { PureComponent } from 'react';
import {
  NOTIONAL_AMOUNT,
  NUM_OF_OPTIONS,
  SETTLE_AMOUNT,
  SETTLE_FORM_CONTROLS,
  UNDERLYER_PRICE,
} from './constants';

class ExerciseModal extends PureComponent<
  {
    visible?: boolean;
    data?: any;
  },
  any
> {
  public $settleForm: Form;

  public data: any;

  public tableFormData: any;

  public currentUser: any;

  public reload: any;

  public state = {
    visible: false,
    modalConfirmLoading: false,
    dataSource: {},
    exportVisible: false,
    productType: 'MODEL_XY',
    notionalType: '',
  };

  public show = (data = {}, tableFormData, currentUser, reload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;
    this.setState({
      visible: true,
      productType: this.data[LEG_TYPE_FIELD],
      notionalType: this.data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE],
      ...(this.data.notionalAmountType === NOTIONAL_AMOUNT_TYPE_MAP.CNY
        ? {
            dataSource: this.computeLotDataSource({
              [NOTIONAL_AMOUNT]: this.data[LEG_FIELD.NOTIONAL_AMOUNT],
            }),
          }
        : {
            dataSource: this.computeCnyDataSource({
              [NUM_OF_OPTIONS]: this.data[LEG_FIELD.NOTIONAL_AMOUNT],
            }),
          }),
    });
  };

  public computeCnyDataSource = value => {
    const notionalAmount = new BigNumber(value[NUM_OF_OPTIONS])
      .multipliedBy(this.data[LEG_FIELD.INITIAL_SPOT])
      .multipliedBy(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
      .toNumber();
    return {
      ...value,
      [NOTIONAL_AMOUNT]: notionalAmount,
    };
  };

  public computeLotDataSource = value => {
    const numOfOptions = new BigNumber(value[NOTIONAL_AMOUNT])
      .div(this.data[LEG_FIELD.INITIAL_SPOT])
      .div(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
      .toNumber();
    return {
      ...value,
      [NUM_OF_OPTIONS]: numOfOptions,
    };
  };

  public switchConfirmLoading = () => {
    this.setState({ modalConfirmLoading: !this.state.modalConfirmLoading });
  };

  public switchModal = () => {
    this.setState({
      visible: false,
    });
  };

  public onConfirm = async () => {
    const rsp = await this.$settleForm.validate();
    if (rsp.error) return;
    const dataSource = this.state.dataSource;
    this.switchConfirmLoading();
    const { error, data } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.SETTLE,
      userLoginId: this.currentUser.username,
      eventDetail: {
        underlyerPrice: String(dataSource[UNDERLYER_PRICE]),
        settleAmount: String(dataSource[SETTLE_AMOUNT]),
        numOfOptions: String(dataSource[NUM_OF_OPTIONS]),
        notionalAmount: String(dataSource[NOTIONAL_AMOUNT]),
      },
    });

    this.switchConfirmLoading();
    if (error) return;
    message.success('结算成功');
    this.setState({
      visible: false,
      exportVisible: true,
    });
  };

  public onValueChange = params => {
    this.setState({
      dataSource: params.values,
    });
  };

  public convertVisible = () => {
    this.setState({
      exportVisible: false,
    });
  };

  public handleSettleAmount = async () => {
    const dataSource = this.state.dataSource;
    if (!dataSource[UNDERLYER_PRICE]) {
      if (!(dataSource[UNDERLYER_PRICE] === 0)) {
        message.error('请填标的物价格');
        return;
      }
    }
    const { error, data } = await tradeExercisePreSettle({
      positionId: this.data.id,
      eventDetail: {
        underlyerPrice: String(dataSource[UNDERLYER_PRICE]),
        numOfOptions: String(dataSource[NUM_OF_OPTIONS]),
        notionalAmount: String(dataSource[NOTIONAL_AMOUNT]),
      },
      eventType: LCM_EVENT_TYPE_MAP.SETTLE,
    });
    if (error) return;
    this.setState({
      dataSource: {
        ...dataSource,
        [SETTLE_AMOUNT]: data,
      },
    });
  };

  public render() {
    const { visible } = this.state;
    return (
      <>
        <CashExportModal
          visible={this.state.exportVisible}
          trade={this.tableFormData}
          convertVisible={this.convertVisible}
          loadData={this.reload}
        />
        <Modal
          closable={false}
          onCancel={this.switchModal}
          onOk={this.onConfirm}
          destroyOnClose={true}
          visible={visible}
          confirmLoading={this.state.modalConfirmLoading}
          title={`结算: (${
            this.state.productType === LEG_TYPE_MAP.FORWARD ? '远期' : '自定义产品'
          })`}
        >
          <Form
            ref={node => {
              this.$settleForm = node;
            }}
            dataSource={this.state.dataSource}
            onValueChange={this.onValueChange}
            controlNumberOneRow={1}
            footer={false}
            controls={SETTLE_FORM_CONTROLS(
              this.state.notionalType,
              this.state.productType,
              this.handleSettleAmount
            )}
          />
          <Alert message="结算金额为正时代表我方收入，金额为负时代表我方支出。" type="info" />
        </Modal>
      </>
    );
  }
}

export default ExerciseModal;
