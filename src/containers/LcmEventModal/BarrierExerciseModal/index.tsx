import { Alert, message, Modal } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import {
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_ZHCH_MAP,
  DIRECTION_TYPE_ZHCN_MAP,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP,
  NOTION_ENUM_MAP,
  BIG_NUMBER_CONFIG,
  REBATETYPE_TYPE_ZHCN_MAP,
  REBATETYPE_TYPE_MAP,
  UNIT_ENUM_MAP,
} from '@/constants/common';
import CashExportModal from '@/containers/CashExportModal';
import { Form2 } from '@/containers';
import { trdTradeLCMEventProcess, tradeExercisePreSettle } from '@/services/trade-service';
import { getMoment } from '@/tools';
import { EXERCISE_FORM_CONTROLS } from './constants';

class BarrierExerciseModal extends PureComponent<
  {
    visible?: boolean;
    data?: any;
  },
  any
> {
  public data: any = {};

  public state = {
    visible: false,
    modalConfirmLoading: false,
    dataSource: {},
    exportVisible: false,
  };

  public computedNotionalAmount = () => {
    const notionalAmountType = this.data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE];
    if (notionalAmountType === NOTION_ENUM_MAP.CNY) {
      return `￥ ${this.data[LEG_FIELD.NOTIONAL_AMOUNT]} (合 ${this.getDefaultOptionsNumber()} 手)`;
    }
    return `￥ ${this.getDefaultNotionalAmount()} (合 ${this.data[LEG_FIELD.NOTIONAL_AMOUNT]} 手)`;
  };

  public getDefaultOptionsNumber = () =>
    new BigNumber(this.data[LEG_FIELD.NOTIONAL_AMOUNT])
      .div(this.data[LEG_FIELD.INITIAL_SPOT])
      .div(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
      .toNumber();

  public getDefaultNotionalAmount = () =>
    new BigNumber(this.data[LEG_FIELD.INITIAL_SPOT])
      .multipliedBy(this.data[LEG_FIELD.NOTIONAL_AMOUNT])
      .multipliedBy(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
      .toNumber();

  public show = (data = {}, tableFormData, currentUser, reload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;
    const expirationDate = this.data[LEG_FIELD.EXPIRATION_DATE];
    const notionalAmount = this.computedNotionalAmount();
    const information = _.values(
      _.mapValues(
        _.pick(this.data, ['direction', LEG_TYPE_FIELD, 'underlyerInstrumentId', 'optionType']),
        (value, key) => {
          if (key === 'direction') {
            return DIRECTION_TYPE_ZHCN_MAP[value];
          }
          if (key === LEG_TYPE_FIELD) {
            return LEG_TYPE_ZHCH_MAP[value];
          }
          if (key === 'optionType') {
            return EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP[value];
          }
          return value;
        },
      ),
    ).join(' | ');
    this.setState({
      visible: true,
      dataSource: Form2.createFields({
        notionalAmount,
        information,
        expirationDate,
      }),
    });
  };

  public switchConfirmLoading = () => {
    this.setState(state => ({ modalConfirmLoading: !state.modalConfirmLoading }));
  };

  public switchModal = () => {
    this.setState({
      visible: false,
    });
  };

  public onConfirm = async () => {
    const rsp = await this.$barrierExerciseModal.validate();
    if (rsp.error) return;
    const dataSource = Form2.getFieldsValue(this.state.dataSource);
    this.switchConfirmLoading();
    const { error, data } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.EXERCISE,
      userLoginId: this.currentUser.username,
      eventDetail: {
        notionalAmount: String(this.data[LEG_FIELD.NOTIONAL_AMOUNT]),
        expirationDate: dataSource.expirationDate,
        underlyerPrice: String(dataSource.underlyerPrice),
        settleAmount: String(dataSource.settleAmount),
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

  public onValueChange = (props, changedFields, allFields) => {
    this.setState(state => ({
      dataSource: {
        ...state.dataSource,
        ...changedFields,
      },
    }));
  };

  public convertVisible = () => {
    this.setState({
      exportVisible: false,
    });
  };

  public handleSettleAmount = async () => {
    const dataSource = Form2.getFieldsValue(this.state.dataSource);
    if (!dataSource.underlyerPrice) {
      if (!(dataSource.underlyerPrice === 0)) {
        message.error('请填标的物价格');
        return;
      }
    }
    const { error, data } = await tradeExercisePreSettle({
      positionId: this.data.id,
      eventDetail: {
        underlyerPrice: String(dataSource.underlyerPrice),
        notionalAmount: String(this.data[LEG_FIELD.NOTIONAL_AMOUNT]),
        expirationDate: dataSource.expirationDate,
      },
      eventType: LCM_EVENT_TYPE_MAP.EXERCISE,
    });
    if (error) return;
    this.setState({
      dataSource: Form2.createFields({
        ...dataSource,
        settleAmount: data,
      }),
    });
  };

  public $barrierExerciseModal: Form2;

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
          maskClosable={false}
          visible={visible}
          confirmLoading={this.state.modalConfirmLoading}
          title={`行权 (${LEG_TYPE_ZHCH_MAP[this.data[LEG_TYPE_FIELD]]})`}
        >
          <Form2
            ref={node => {
              this.$barrierExerciseModal = node;
            }}
            dataSource={this.state.dataSource}
            onFieldsChange={this.onValueChange}
            footer={false}
            columns={EXERCISE_FORM_CONTROLS(this.handleSettleAmount)}
          />
          <Alert message="结算金额为正时代表我方收入，金额为负时代表我方支出。" type="info" />
        </Modal>
      </>
    );
  }
}

export default BarrierExerciseModal;
