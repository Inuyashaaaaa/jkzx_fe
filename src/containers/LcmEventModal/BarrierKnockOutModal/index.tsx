import { Alert, message, Modal, Popconfirm, Button } from 'antd';
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
  OBSERVATION_TYPE_MAP,
  OB_DAY_FIELD,
} from '@/constants/common';
import CashExportModal from '@/containers/CashExportModal';
import { Form2 } from '@/containers';
import { trdTradeLCMEventProcess, tradeExercisePreSettle } from '@/services/trade-service';
import { getMoment } from '@/tools';
import {
  KNOCKOUT_FORM_CONTROLS,
  KNOCK_OUT_DATE,
  NOTIONAL_AMOUNT,
  SETTLE_AMOUNT,
  UNDERLYER_PRICE,
} from './constants';

class BarrierKnockOutModal extends PureComponent<
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
    rebateType: true,
  };

  public getInitialKnockOutDate = data => {
    if (data[LEG_FIELD.OBSERVATION_TYPE] === OBSERVATION_TYPE_MAP.DISCRETE) {
      const dateVals = (data[LEG_FIELD.OBSERVATION_DATES] || [])
        .filter(
          item =>
            getMoment(item[OB_DAY_FIELD]).isBefore(moment()) ||
            getMoment(item[OB_DAY_FIELD]).isSame(moment()),
        )
        .sort(
          (a, b) => getMoment(a[OB_DAY_FIELD]).valueOf() - getMoment(b[OB_DAY_FIELD]).valueOf(),
        );
      if (!dateVals.length) return moment();
      return moment(dateVals[dateVals.length - 1][OB_DAY_FIELD]);
    }
    if (data[LEG_FIELD.OBSERVATION_TYPE] === OBSERVATION_TYPE_MAP.TERMINAL) {
      return getMoment(data[LEG_FIELD.EXPIRATION_DATE]);
    }
    if (data[LEG_FIELD.OBSERVATION_TYPE] === OBSERVATION_TYPE_MAP.CONTINUOUS) {
      return moment();
    }
    return moment();
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
    const rebateType = this.data[LEG_FIELD.REBATE_TYPE];
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
    // const notional =
    //   this.data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTION_ENUM_MAP.CNY
    //     ? this.data[LEG_FIELD.NOTIONAL_AMOUNT]
    //     : new BigNumber(this.data[LEG_FIELD.NOTIONAL_AMOUNT])
    //         .multipliedBy(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
    //         .multipliedBy(this.data[LEG_FIELD.INITIAL_SPOT])
    //         .toNumber();
    // const settleAmountUnit =
    //   this.data[LEG_FIELD.REBATE_TYPE] === REBATETYPE_TYPE_MAP.PAY_NONE
    //     ? 0
    //     : this.data[LEG_FIELD.REBATE];
    const settleAmount = '';
    // this.data[LEG_FIELD.REBATE_UNIT] === UNIT_ENUM_MAP.CNY
    //   ? settleAmountUnit
    //   : new BigNumber(settleAmountUnit)
    //       .multipliedBy(0.01)
    //       .multipliedBy(notional)
    //       .toNumber();
    // 支付日期
    // const paymentDate =
    //   this.data[LEG_FIELD.REBATE_TYPE] === REBATETYPE_TYPE_MAP.PAY_AT_EXPIRY
    //     ? getMoment(expirationDate)
    //     : this.getInitialKnockOutDate(this.data);
    const date = this.getInitialKnockOutDate(this.data);
    this.setState({
      visible: true,
      dataSource: Form2.createFields({
        notionalAmount,
        information,
        rebateType,
        expirationDate,
        settleAmount,
        paymentDate: date,
        knockOutDate: date,
      }),
      rebateType: this.data[LEG_FIELD.REBATE_TYPE] === REBATETYPE_TYPE_MAP.PAY_NONE,
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
    const rsp = await this.$barrierKnockOutModal.validate();
    if (rsp.error) return;
    const dataSource = Form2.getFieldsValue(this.state.dataSource);
    this.switchConfirmLoading();
    const { error, data } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.KNOCK_OUT,
      userLoginId: this.currentUser.username,
      eventDetail: {
        underlyerPrice: String(dataSource.underlyerPrice),
        settleAmount: String(dataSource.settleAmount),
        notionalAmount: String(this.data[LEG_FIELD.NOTIONAL_AMOUNT]),
        knockOutDate: getMoment(dataSource.knockOutDate).format('YYYY-MM-DD'),
        expirationDate: dataSource.expirationDate,
        paymentDate: getMoment(dataSource.knockOutDate).format('YYYY-MM-DD'),
        rebateType: dataSource.rebateType,
      },
    });

    this.switchConfirmLoading();
    if (error) return;
    message.success('敲出成功');
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
        notionalAmount: String(this.data[LEG_FIELD.NOTIONAL_AMOUNT]),
        knockOutDate: dataSource[KNOCK_OUT_DATE].format('YYYY-MM-DD'),
      },
      eventType: LCM_EVENT_TYPE_MAP.KNOCK_OUT,
    });
    if (error) return;
    this.setState({
      dataSource: Form2.createFields({
        ...dataSource,
        [SETTLE_AMOUNT]: data,
      }),
    });
  };

  public $barrierKnockOutModal: Form2;

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
          // onCancel={this.switchModal}
          // onOk={this.onConfirm}
          footer={
            <>
              <Button onClick={this.switchModal}>取消</Button>
              <Popconfirm
                title="确认敲出？"
                okText="确定"
                cancelText="取消"
                onConfirm={this.onConfirm}
              >
                <Button type="primary">确定</Button>
              </Popconfirm>
            </>
          }
          maskClosable={false}
          visible={visible}
          confirmLoading={this.state.modalConfirmLoading}
          title={`敲出 (${LEG_TYPE_ZHCH_MAP[this.data[LEG_TYPE_FIELD]]})`}
        >
          <Form2
            ref={node => {
              this.$barrierKnockOutModal = node;
            }}
            dataSource={this.state.dataSource}
            onFieldsChange={this.onValueChange}
            footer={false}
            columns={KNOCKOUT_FORM_CONTROLS(this.state.rebateType, this.handleSettleAmount)}
          />
          <Alert message="结算金额为正时代表我方收入，金额为负时代表我方支出。" type="info" />
        </Modal>
      </>
    );
  }
}

export default BarrierKnockOutModal;
