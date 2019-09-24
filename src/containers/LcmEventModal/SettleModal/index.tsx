import { Alert, message, Modal } from 'antd';
import BigNumber from 'bignumber.js';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import {
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
  LEG_TYPE_MAP,
  LEG_TYPE_ZHCH_MAP,
  LEG_TYPE_FIELD,
} from '@/constants/common';
import CashExportModal from '@/containers/CashExportModal';
import Form from '@/containers/Form';
import { tradeExercisePreSettle, trdTradeLCMEventProcess } from '@/services/trade-service';
import {
  NOTIONAL_AMOUNT,
  NUM_OF_OPTIONS,
  SETTLE_AMOUNT,
  SETTLE_FORM_CONTROLS,
  UNDERLYER_PRICE,
  CASHFLOW_SETTLE_FORM_CONTROLS,
  SETTLE_FORM_CONTROLS_RANGE_ACCRUALS,
} from './constants';
import { Form2 } from '@/containers';
import { getMoment } from '@/tools';

class ExerciseModal extends PureComponent<
  {
    visible?: boolean;
    data?: any;
  },
  any
> {
  public state = {
    visible: false,
    modalConfirmLoading: false,
    dataSource: {},
    exportVisible: false,
    productType: 'MODEL_XY',
    notionalType: '',
    cashFlowDataSource: {},
  };

  // public componentDidMount = () => {
  //   if (_.get(this.data, '$legType') === LEG_TYPE_MAP.RANGE_ACCRUALS) {
  //     this.handleSettleAmount();
  //   }
  // }

  public show = (data = {}, tableFormData, currentUser, reload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;
    this.setState(
      {
        visible: true,
        productType: this.data[LEG_TYPE_FIELD],
        notionalType: this.data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE],
        cashFlowDataSource:
          this.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.CASH_FLOW
            ? Form2.createFields({
                ...this.data,
              })
            : {},
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
      },
      () => {
        if (_.get(this.data, '$legType') === LEG_TYPE_MAP.RANGE_ACCRUALS) {
          this.handleSettleAmount();
        }
      },
    );
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
    const { modalConfirmLoading } = this.state;
    this.setState({ modalConfirmLoading: !modalConfirmLoading });
  };

  public switchModal = () => {
    this.setState({
      visible: false,
    });
  };

  public onConfirm = async () => {
    // if (this.state.productType === LEG_TYPE_MAP.CASH_FLOW) {
    //   this.switchConfirmLoading();
    //   const formData = Form2.getFieldsValue(this.state.cashFlowDataSource);
    //   const { error, data } = await trdTradeLCMEventProcess({
    //     positionId: this.data.id,
    //     tradeId: this.tableFormData.tradeId,
    //     eventType: LCM_EVENT_TYPE_MAP.SETTLE,
    //     userLoginId: this.currentUser.username,
    //     eventDetail: {
    //       paymentDate: getMoment(formData.paymentDate).format('YYYY-MM-DD'),
    //       paymentAmount: String(formData.paymentAmount),
    //       paymentDirection: formData.paymentDirection,
    //     },
    //   });

    //   this.switchConfirmLoading();
    //   if (error) return;
    //   message.success('结算成功');
    //   this.setState({
    //     visible: false,
    //     exportVisible: true,
    //   });
    //   return;
    // }

    const rsp = await this.$settleForm.validate();
    if (rsp.error) return;
    const { dataSource, cashFlowDataSource } = this.state;
    let rspError;
    this.switchConfirmLoading();
    if (this.state.productType === LEG_TYPE_MAP.CASH_FLOW) {
      const formData = Form2.getFieldsValue(cashFlowDataSource);
      const { error, data } = await trdTradeLCMEventProcess({
        positionId: this.data.id,
        tradeId: this.tableFormData.tradeId,
        eventType: LCM_EVENT_TYPE_MAP.SETTLE,
        userLoginId: this.currentUser.username,
        eventDetail: {
          paymentDate: getMoment(formData.paymentDate).format('YYYY-MM-DD'),
          paymentAmount: String(formData.paymentAmount),
          paymentDirection: formData.paymentDirection,
        },
      });
      rspError = error;
    } else {
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
      rspError = error;
    }

    this.switchConfirmLoading();
    if (rspError) return;
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
    const { dataSource } = this.state;
    if (_.get(this.data, '$legType') === LEG_TYPE_MAP.RANGE_ACCRUALS) {
      const { error, data } = await tradeExercisePreSettle({
        positionId: this.data.id,
        eventDetail: {
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
      return;
    }
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

  public $settleForm: Form;

  public data: any;

  public tableFormData: any;

  public currentUser: any;

  public reload: any;

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
          destroyOnClose
          visible={visible}
          confirmLoading={this.state.modalConfirmLoading}
          title={`结算: (${LEG_TYPE_ZHCH_MAP[LEG_TYPE_MAP[this.state.productType]]})`}
        >
          {this.state.productType === LEG_TYPE_MAP.CASH_FLOW ? (
            <Form2
              ref={node => {
                this.$settleForm = node;
              }}
              dataSource={this.state.cashFlowDataSource}
              footer={false}
              columns={CASHFLOW_SETTLE_FORM_CONTROLS}
            />
          ) : (
            <Form
              ref={node => {
                this.$settleForm = node;
              }}
              dataSource={this.state.dataSource}
              onValueChange={this.onValueChange}
              controlNumberOneRow={1}
              footer={false}
              controls={
                _.get(this.data, '$legType') === LEG_TYPE_MAP.RANGE_ACCRUALS
                  ? SETTLE_FORM_CONTROLS_RANGE_ACCRUALS(
                      this.state.notionalType,
                      this.state.productType,
                      this.handleSettleAmount,
                    )
                  : SETTLE_FORM_CONTROLS(
                      this.state.notionalType,
                      this.state.productType,
                      this.handleSettleAmount,
                    )
              }
            />
          )}

          <Alert message="结算金额为正时代表我方收入，金额为负时代表我方支出。" type="info" />
        </Modal>
      </>
    );
  }
}

export default ExerciseModal;
