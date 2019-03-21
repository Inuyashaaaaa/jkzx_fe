import {
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP,
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
} from '@/constants/common';
import Form from '@/design/components/Form';
import { tradeExercisePreSettle, trdTradeLCMEventProcess } from '@/services/trade-service';
import { Button, message, Modal } from 'antd';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import React, { PureComponent } from 'react';
import ExportModal from '../../ExportModal';
import {
  EXERCISE_PRICE,
  EXPIRATION_CALL_PUT_FORM_CONTROLS,
  EXPIRATION_FIXED_FORM_CONTROLS,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE,
  MATURES,
  NOTIONAL_AMOUNT,
  SETTLE_AMOUNT,
  UNDERLYER_PRICE,
} from './constants';

class ExpirationModal extends PureComponent<
  {
    visible?: boolean;
    data?: any;
  },
  any
> {
  public $expirationFixedModal: Form;

  public $expirationCallModal: Form;

  public data: any;

  public tableFormData: any;

  public currentUser: any;

  public reload: any;

  public state = {
    visible: false,
    autoCallPaymentType: null,
    modalConfirmLoading: false,
    exportVisible: false,
    fixedDataSource: {},
    callPutDataSource: {},
    premiumType: null,
  };

  public show = (data = {}, tableFormData, currentUser, reload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;

    console.log(this.data);
    const premiumType = this.data[LEG_FIELD.AUTO_CALL_STRIKE_UNIT];
    const autoCallPaymentType = this.data[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE];
    this.setState({
      visible: true,
      autoCallPaymentType,
      premiumType,
      ...(this.data[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE] ===
      EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED
        ? {
            fixedDataSource: this.computeFixedDataSource(this.data),
          }
        : {
            callPutDataSource: this.computeCallPutDataSource(this.data),
          }),
    });
  };

  public computeFixedDataSource = value => {
    const notionalAmount = value[LEG_FIELD.NOTIONAL_AMOUNT];
    const matures = value[LEG_FIELD.EXPIRE_NOBARRIERPREMIUM];
    const countDay = new BigNumber(
      moment(value[LEG_FIELD.EXPIRATION_DATE]).valueOf() -
        moment(value[LEG_FIELD.EFFECTIVE_DATE]).valueOf()
    )
      .div(86400000)
      .decimalPlaces(0)
      .toNumber();
    const dayOfYear = value[LEG_FIELD.DAYS_IN_YEAR];
    return {
      [EXPIRE_NO_BARRIER_PREMIUM_TYPE]:
        EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP[value[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE]],
      [NOTIONAL_AMOUNT]: notionalAmount,
      [MATURES]: matures,
      [SETTLE_AMOUNT]: new BigNumber(notionalAmount)
        .multipliedBy(new BigNumber(matures).div(100))
        .multipliedBy(countDay)
        .div(dayOfYear)
        .toNumber(),
    };
  };

  public computeCallPutDataSource = value => {
    const notionalAmount = value[LEG_FIELD.NOTIONAL_AMOUNT];
    const autoCallStrike = value[LEG_FIELD.AUTO_CALL_STRIKE];
    return {
      [EXPIRE_NO_BARRIER_PREMIUM_TYPE]:
        EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP[value[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE]],
      [NOTIONAL_AMOUNT]: notionalAmount,
      [EXERCISE_PRICE]: autoCallStrike,
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
    const dataSource =
      this.data[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE] ===
      EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED
        ? this.state.fixedDataSource
        : this.state.callPutDataSource;
    this.switchConfirmLoading();
    const { error, data } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.EXERCISE,
      userLoginId: this.currentUser.userName,
      eventDetail: {
        ...(dataSource[UNDERLYER_PRICE]
          ? { underlyerProce: String(dataSource[UNDERLYER_PRICE]) }
          : null),
        settleAmount: String(dataSource[SETTLE_AMOUNT]),
      },
    });

    this.switchConfirmLoading();
    if (error) return;
    message.success('行权成功');
    this.setState({
      visible: false,
      exportVisible: true,
    });
  };

  public onCallValueChange = params => {
    this.setState({
      callPutDataSource: params.values,
    });
  };

  public onFixedValueChange = params => {
    this.setState({
      fixedDataSource: params.values,
    });
  };

  public convertVisible = () => {
    this.setState({
      exportVisible: false,
    });
  };

  public handleSettleAmount = async () => {
    const dataSource = this.state.callPutDataSource;
    const { error, data } = await tradeExercisePreSettle({
      positionId: this.data.id,
      eventDetail: {
        underlyerPrice: String(dataSource[UNDERLYER_PRICE]),
        notionalAmount: String(dataSource[NOTIONAL_AMOUNT]),
      },
      eventType: LCM_EVENT_TYPE_MAP.EXERCISE,
    });
    if (error) return;
    this.setState({
      callPutDataSource: {
        ...dataSource,
        [SETTLE_AMOUNT]: data,
      },
    });
  };

  public render() {
    const { visible } = this.state;
    return (
      <>
        <ExportModal
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
          title={'到期结算 (雪球式)'}
        >
          {/* <Form
            wrappedComponentRef={node => {
              this.$expirationModal = node;
            }}
            dataSource={this.state.dataSource}
            onValueChange={this.onValueChange}
            controlNumberOneRow={1}
            footer={false}
            controls={EXPIRATION_FIXED_FORM_CONTROLS}
          /> */}
          {this.state.autoCallPaymentType === EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED ? (
            <Form
              wrappedComponentRef={node => {
                this.$expirationFixedModal = node;
              }}
              dataSource={this.state.fixedDataSource}
              onValueChange={this.onFixedValueChange}
              controlNumberOneRow={1}
              footer={false}
              controls={EXPIRATION_FIXED_FORM_CONTROLS}
            />
          ) : (
            <>
              <Form
                wrappedComponentRef={node => {
                  this.$expirationCallModal = node;
                }}
                dataSource={this.state.callPutDataSource}
                onValueChange={this.onCallValueChange}
                controlNumberOneRow={1}
                footer={false}
                controls={EXPIRATION_CALL_PUT_FORM_CONTROLS(
                  this.state.premiumType,
                  this.handleSettleAmount
                )}
              />
            </>
          )}
        </Modal>
      </>
    );
  }
}

export default ExpirationModal;
