import PopconfirmButton from '@/components/PopconfirmButton';
import {
  BIG_NUMBER_CONFIG,
  DIRECTION_TYPE_MAP,
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
  NOTIONAL_AMOUNT_TYPE_MAP,
} from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/design/components/Form';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { isSameDay, wrapMoment } from '@/utils';
import { Button, Col, message, Modal, Row } from 'antd';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { NOTIONAL_AMOUNT, NUM_OF_OPTIONS, SETTLE_AMOUNT, UNDERLYER_PRICE } from './constants';

const OPTIONS_NUMBER = 'optionsNumber';

class AsianExerciseModal extends PureComponent<
  {
    visible?: boolean;
    data?: any;
  },
  any
> {
  public $exerciseForm: Form;

  public data: any = {};

  public tableFormData: any = {};

  public currentUser: any = {};

  public reload: any;

  public state = {
    visible: false,
    direction: 'BUYER',
    modalConfirmLoading: false,
    dataSource: {},
    exportVisible: false,
    formData: {},
  };

  public show = (data = {}, tableFormData, currentUser, reload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;

    this.setState({
      visible: true,
      formData: this.getDefaultFormData(),
    });
  };

  public getDefaultFormData = () => {
    return {
      [LEG_FIELD.NOTIONAL_AMOUNT]:
        this.data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.CNY
          ? this.data[LEG_FIELD.NOTIONAL_AMOUNT]
          : this.getDefaultNotionalAmount(),
      [OPTIONS_NUMBER]: this.data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.CNY,
    };
  };

  public getDefaultNotionalAmount = () => {
    // 期初价格*护合约手数* 合约乘数
    return new BigNumber(this.data[LEG_FIELD.INITIAL_SPOT])
      .multipliedBy(this.data[LEG_FIELD.NOTIONAL_AMOUNT])
      .multipliedBy(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
      .toNumber();
  };

  public computeCnyDataSource = (value, changed = {}) => {
    return {
      ...value,
      [NOTIONAL_AMOUNT]: new BigNumber(value[NUM_OF_OPTIONS])
        .multipliedBy(this.data[LEG_FIELD.INITIAL_SPOT])
        .multipliedBy(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
        .toNumber(),
      [SETTLE_AMOUNT]: changed[SETTLE_AMOUNT]
        ? changed[SETTLE_AMOUNT]
        : new BigNumber(value[NUM_OF_OPTIONS]).multipliedBy(value[UNDERLYER_PRICE]).toNumber(),
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
    const dataSource = this.state.dataSource;
    this.switchConfirmLoading();
    const { error, data } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.EXERCISE,
      userLoginId: this.currentUser.userName,
      eventDetail: {
        underlyerPrice: String(dataSource[UNDERLYER_PRICE]),
        settleAmount: String(dataSource[SETTLE_AMOUNT]),
        numOfOptions: String(dataSource[NUM_OF_OPTIONS]),
        notionalAmount: String(dataSource[NOTIONAL_AMOUNT]),
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

  public convertVisible = () => {
    this.setState({
      exportVisible: false,
    });
  };

  public isCanExercise = () => {
    const now = moment();
    // 今天是最后一个观察日
    const last = _.last(this.state.tableData).day || {};
    if (last && isSameDay(now, last)) {
      return true;
    }

    if (isSameDay(this.data[LEG_FIELD.EXPIRATION_DATE], now)) {
      return true;
    }

    return false;
  };

  public filterObDays = tableData => {
    return tableData.filter(item => {
      return wrapMoment(item).valueOf() <= moment().valueOf();
    });
  };

  public getTitle = () => {
    return this.data[LEG_FIELD.DIRECTION] === DIRECTION_TYPE_MAP.BUYER ? '我方行权' : '对方行权';
  };

  public onConfirm = async () => {};

  public render() {
    const { visible } = this.state;
    return (
      <>
        <Modal
          footer={
            <Row type="flex" justify="space-between">
              <Col />
              <Col>
                <Button onClick={this.switchModal}>取消</Button>
                <PopconfirmButton
                  style={{ marginLeft: VERTICAL_GUTTER }}
                  type="primary"
                  popconfirmProps={{
                    title: '确认行权操作？',
                    onConfirm: this.onConfirm,
                  }}
                >
                  确认
                </PopconfirmButton>
              </Col>
            </Row>
          }
          closable={false}
          destroyOnClose={true}
          visible={visible}
          title={this.getTitle()}
        >
          <Form
            footer={false}
            dataSource={this.state.formData}
            controls={[
              {
                field: OPTIONS_NUMBER,
                control: {
                  label: '期权数量(手数)',
                },
                input: {
                  ...INPUT_NUMBER_DIGITAL_CONFIG,
                  disabled: true,
                },
              },
              {
                field: LEG_FIELD.NOTIONAL_AMOUNT,
                control: {
                  label: '名义金额',
                },
                input: {
                  ...INPUT_NUMBER_CURRENCY_CNY_CONFIG,
                  disabled: true,
                },
              },
              {
                field: 'subjectmatterAvg',
                control: {
                  label: '标的物均价（¥）',
                },
                input: {
                  ...INPUT_NUMBER_CURRENCY_CNY_CONFIG,
                  disabled: true,
                },
              },
              {
                field: LEG_FIELD.STRIKE,
                control: {
                  label: '行权价（¥）',
                },
                input: {
                  ...INPUT_NUMBER_CURRENCY_CNY_CONFIG,
                  disabled: true,
                },
              },
              {
                field: 'settlementPrice',
                control: {
                  label: '结算金额',
                },
                input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
                decorator: {
                  rules: [
                    {
                      required: true,
                    },
                    {
                      message: '结算金额不能小与0',
                      validator(rule, value, callback) {
                        if (value < 0) {
                          return callback(true);
                        }
                        callback();
                      },
                    },
                  ],
                },
              },
            ]}
          />
        </Modal>
      </>
    );
  }
}

export default AsianExerciseModal;
