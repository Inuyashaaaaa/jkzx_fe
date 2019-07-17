import { Alert, Button, Col, message, Modal, Row } from 'antd';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import React, { PureComponent } from 'react';
import PopconfirmButton from '@/containers/PopconfirmButton';
import {
  BIG_NUMBER_CONFIG,
  DIRECTION_TYPE_MAP,
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  NOTION_ENUM_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  UNIT_ENUM_MAP,
} from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/containers/Form';
import { convertObservetions } from '@/services/common';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { getMoment } from '@/tools';
import { countAvg } from '../utils';
import { NOTIONAL_AMOUNT, NUM_OF_OPTIONS, SETTLE_AMOUNT, UNDERLYER_PRICE } from './constants';
import CashExportModal from '@/containers/CashExportModal';

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
  public data: any = {};

  public tableFormData: any = {};

  public currentUser: any = {};

  public cancelNeedReload: boolean = false;

  public state = {
    visible: false,
    modalConfirmLoading: false,
    formData: {},
    productType: 'ASIAN',
    exportVisible: false,
    strikeType: null,
  };

  public show = (data, tableFormData, currentUser, reload, cancelNeedReload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;
    this.cancelNeedReload = cancelNeedReload;
    this.setState({
      visible: true,
      productType: this.data[LEG_TYPE_FIELD],
      formData: this.getDefaultFormData(),
      strikeType: this.data[LEG_FIELD.STRIKE_TYPE],
    });
  };

  public getDefaultFormData = () => ({
    [LEG_FIELD.NOTIONAL_AMOUNT]:
      this.data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.CNY
        ? this.data[LEG_FIELD.NOTIONAL_AMOUNT]
        : this.getDefaultNotionalAmount(),
    [OPTIONS_NUMBER]:
      this.data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE] === NOTIONAL_AMOUNT_TYPE_MAP.LOT
        ? this.data[LEG_FIELD.NOTIONAL_AMOUNT]
        : this.getDefaultOptionsNumber(),
    [SUBJECT_MATTER_AVG]: countAvg(convertObservetions(this.data), this.data),
    [LEG_FIELD.STRIKE]: this.data[LEG_FIELD.STRIKE],
  });

  public getDefaultOptionsNumber = () =>
    // 名义本金 / 期初价格 / 合约乘数
    new BigNumber(this.data[LEG_FIELD.NOTIONAL_AMOUNT])
      .div(this.data[LEG_FIELD.INITIAL_SPOT])
      .div(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
      .toNumber();

  public getDefaultNotionalAmount = () =>
    // 期初价格*护合约手数* 合约乘数
    new BigNumber(this.data[LEG_FIELD.INITIAL_SPOT])
      .multipliedBy(this.data[LEG_FIELD.NOTIONAL_AMOUNT])
      .multipliedBy(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
      .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
      .toNumber();

  public computeCnyDataSource = (value, changed = {}) => ({
    ...value,
    [NOTIONAL_AMOUNT]: new BigNumber(value[NUM_OF_OPTIONS])
      .multipliedBy(this.data[LEG_FIELD.INITIAL_SPOT])
      .multipliedBy(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
      .toNumber(),
    [SETTLE_AMOUNT]: changed[SETTLE_AMOUNT]
      ? changed[SETTLE_AMOUNT]
      : new BigNumber(value[NUM_OF_OPTIONS]).multipliedBy(value[UNDERLYER_PRICE]).toNumber(),
  });

  public switchConfirmLoading = () => {
    this.setState(state => ({ modalConfirmLoading: !state.modalConfirmLoading }));
  };

  public switchModal = () => {
    this.setState(
      {
        visible: false,
      },
      () => {
        if (this.cancelNeedReload) {
          this.reload();
        }
      },
    );
  };

  public filterObDays = tableData =>
    tableData.filter(item => getMoment(item).valueOf() <= moment().valueOf());

  public getTitle = () => {
    // @todo xxxx
    if (this.isRange()) {
      return '到期结算';
    }
    return this.data[LEG_FIELD.DIRECTION] === DIRECTION_TYPE_MAP.BUYER ? '我方行权' : '对方行权';
  };

  public onConfirm = async () => {
    const rsp = await this.$form.validate();
    if (rsp.error) return;
    const { error } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.EXERCISE,
      userLoginId: this.currentUser.username,
      eventDetail: {
        underlyerPrice: String(this.state.formData[SUBJECT_MATTER_AVG]),
        settleAmount: String(this.state.formData[SETTLEA_MOUNT]),
      },
    });

    if (error) return;
    message.success('行权成功');
    this.setState({
      visible: false,
      exportVisible: true,
    });
  };

  public onValueChange = params => {
    this.setState({
      formData: params.values,
    });
  };

  public isRange = () =>
    this.state.productType === LEG_TYPE_MAP.RANGE_ACCRUALS_UNANNUAL ||
    this.state.productType === LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL ||
    this.state.productType === LEG_TYPE_MAP.RANGE_ACCRUALS;

  public convertVisible = () => {
    this.setState({
      exportVisible: false,
    });
  };

  public $exerciseForm: Form;

  public reload: any;

  public subjectMatterAvg: any;

  public $form: Form;

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
          destroyOnClose
          visible={visible}
          title={this.getTitle()}
        >
          <Form
            ref={node => {
              this.$form = node;
            }}
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
                  label: '名义金额 (￥)',
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
              ...(this.isRange()
                ? []
                : [
                    {
                      field: LEG_FIELD.STRIKE,
                      control: {
                        label:
                          this.state.strikeType === UNIT_ENUM_MAP.CNY
                            ? '行权价（¥）'
                            : '行权价（%）',
                      },
                      input: {
                        ...INPUT_NUMBER_CURRENCY_CNY_CONFIG,
                        disabled: true,
                      },
                    },
                  ]),
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
                      message: '结算金额为必填项',
                    },
                  ],
                },
              },
            ]}
          />
          <Alert message="结算金额为正时代表我方收入，金额为负时代表我方支出。" type="info" />
        </Modal>
      </>
    );
  }
}

export default AsianExerciseModal;
