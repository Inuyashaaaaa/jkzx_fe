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
import { convertObservetions } from '@/services/common';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { getMoment } from '@/utils';
import { Button, Col, message, Modal, Row } from 'antd';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { countAvg } from '../../utils';
import { NOTIONAL_AMOUNT, NUM_OF_OPTIONS, SETTLE_AMOUNT, UNDERLYER_PRICE } from './constants';

const OPTIONS_NUMBER = 'optionsNumber';

const SUBJECT_MATTER_AVG = 'SUBJECT_MATTER_AVG';

const SETTLEA_MOUNT = 'SETTLEA_MOUNT';

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

  public subjectMatterAvg: any;

  public $form: Form;

  public state = {
    visible: false,
    direction: 'BUYER',
    modalConfirmLoading: false,
    dataSource: {},
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
      [OPTIONS_NUMBER]:
        this.data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.LOT
          ? this.data[LEG_FIELD.NOTIONAL_AMOUNT]
          : this.getDefaultOptionsNumber(),
      [SUBJECT_MATTER_AVG]: countAvg(convertObservetions(this.data)),
      [LEG_FIELD.STRIKE]: this.data[LEG_FIELD.STRIKE],
    };
  };

  public getDefaultOptionsNumber = () => {
    // 名义本金 / 期初价格 / 合约乘数
    return new BigNumber(this.data[LEG_FIELD.NOTIONAL_AMOUNT])
      .multipliedBy(this.data[LEG_FIELD.INITIAL_SPOT])
      .multipliedBy(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
      .toNumber();
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

  public filterObDays = tableData => {
    return tableData.filter(item => {
      return getMoment(item).valueOf() <= moment().valueOf();
    });
  };

  public getTitle = () => {
    return this.data[LEG_FIELD.DIRECTION] === DIRECTION_TYPE_MAP.BUYER ? '我方行权' : '对方行权';
  };

  public onConfirm = async () => {
    const rsp = await this.$form.validate();
    if (rsp.error) return;
    const { error } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.EXERCISE,
      userLoginId: this.currentUser.userName,
      eventDetail: {
        underlyerPrice: String(this.state.formData[SUBJECT_MATTER_AVG]),
        settleAmount: String(this.state.formData[SETTLEA_MOUNT]),
      },
    });

    if (error) return;
    message.success('行权成功');
    this.setState(
      {
        visible: false,
      },
      () => {
        this.reload();
      }
    );
  };

  public onValueChange = params => {
    this.setState({
      formData: params.values,
    });
  };

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
            ref={node => (this.$form = node)}
            footer={false}
            dataSource={this.state.formData}
            onValueChange={this.onValueChange}
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
                field: SUBJECT_MATTER_AVG,
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
                field: SETTLEA_MOUNT,
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
