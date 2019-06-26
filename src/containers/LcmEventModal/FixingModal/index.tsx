/*eslint-disable */
import { ITableColDef } from '@/components/type';
import {
  BIG_NUMBER_CONFIG,
  KNOCK_DIRECTION_MAP,
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  OB_DAY_FIELD,
  UNIT_ENUM_MAP2,
  UP_BARRIER_TYPE_MAP,
} from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, SmartTable } from '@/containers';
import Form from '@/containers/Form';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { formatMoney, getMoment, isRangeAccruals, isAsian } from '@/tools';
import { Button, Col, message, Modal, Row, Tag } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import AsianExerciseModal from '../AsianExerciseModal';
import { OB_LIFE_PAYMENT, OB_PRICE_FIELD } from '../constants';
import ExpirationModal from '../ExpirationModal';
import KnockOutModal from '../KnockOutModal';
import { getObservertionFieldData } from '../tools';
import { countAvg, filterObDays } from '../utils';
import { NOTIONAL_AMOUNT, NUM_OF_OPTIONS, SETTLE_AMOUNT, UNDERLYER_PRICE } from './constants';

class FixingModal extends PureComponent<
  {
    visible?: boolean;
    data?: any;
  },
  any
> {
  public data: any = {};

  public tableFormData: any = {};

  public currentUser: any = {};

  public state = {
    visible: false,
    modalConfirmLoading: false,
    tableData: [],
    avg: 0,
    upBarrierType: '',
  };

  public show = (data = {}, tableFormData, currentUser, reload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;
    const tableData = filterObDays(getObservertionFieldData(data)).map(item => ({
      ...item,
      [OB_PRICE_FIELD]: Form2.createField(item[OB_PRICE_FIELD]),
    }));
    this.setState(
      {
        tableData,
        upBarrierType: this.data[LEG_FIELD.UP_BARRIER_TYPE],
        visible: true,
      },
      () => {
        this.setState({
          avg: this.countAvg(),
        });
      },
    );
  };

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
    this.setState({ modalConfirmLoading: !this.state.modalConfirmLoading });
  };

  public switchModal = () => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.reload();
      },
    );
  };

  public onConfirm = async () => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.$expirationModal.show(
          this.data,
          this.tableFormData,
          this.currentUser,
          this.reload,
          this.state.tableData,
        );
      },
    );
  };

  public onAsianExerciseConfirm = async () => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.$asianExerciseModal.show(this.data, this.tableFormData, this.currentUser, this.reload);
      },
    );
  };

  public onKnockOutConfirm = async () => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.$knockOutModal.show(this.data, this.tableFormData, this.currentUser, this.reload);
      },
    );
  };

  public isCanExercise = () => {
    if (_.isEmpty(this.data)) return false;

    // 区间累计和亚式
    const obdatas = getObservertionFieldData(this.data);
    const now = moment();
    const last = getMoment(_.get(_.last(obdatas) || {}, [OB_DAY_FIELD]));

    const expirationDate = getMoment(this.data[LEG_FIELD.EXPIRATION_DATE]);

    // 今天是最后一个观察日
    const a = last.isSame(now, 'day');
    // 所有观察日都已经填写观察到价格
    const b = obdatas.every(item => _.isNumber(item[OB_PRICE_FIELD]));
    // 今天是到期日
    const c = expirationDate.isSame(now, 'day');

    if ((a || c) && b) {
      return true;
    }
    return false;
  };

  public countAvg = () => {
    const tableData = this.state.tableData.map(item => Form2.getFieldsValue(item));
    return countAvg(tableData, this.data);
  };

  public onCellValueChanged = params => {
    if (params.dataIndex === OB_PRICE_FIELD && params.record[OB_PRICE_FIELD]) {
      this.startOb(params.record);
    }
  };

  public onCellFieldsChanged = params => {
    if (this.isAutocallPhoenix()) {
      this.data = {
        ...this.data,
        [LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY]: this.data[
          LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY
        ].map(item => {
          if (item[OB_DAY_FIELD] === params.record[OB_DAY_FIELD]) {
            return {
              [OB_DAY_FIELD]: params.record[OB_DAY_FIELD],
              [OB_PRICE_FIELD]: Form2.getFieldValue(params.record[OB_PRICE_FIELD]),
            };
          }
          return item;
        }),
      };
    }
    if (isRangeAccruals(this.data) || isAsian(this.data)) {
      this.data = {
        ...this.data,
        [LEG_FIELD.OBSERVATION_DATES]: this.data[LEG_FIELD.OBSERVATION_DATES].map(item => {
          if (item[OB_DAY_FIELD] === params.record[OB_DAY_FIELD]) {
            return {
              ...item,
              [OB_DAY_FIELD]: params.record[OB_DAY_FIELD],
              [OB_PRICE_FIELD]: Form2.getFieldValue(params.record[OB_PRICE_FIELD]),
            };
          }
          return item;
        }),
      };
    }
    const tableData = filterObDays(getObservertionFieldData(this.data)).map(item => ({
      ...item,
      [OB_PRICE_FIELD]: Form2.createField(item[OB_PRICE_FIELD]),
    }));
    this.setState(
      {
        tableData,
      },
      () => {
        this.setState({
          avg: this.countAvg(),
        });
      },
    );
  };

  public startOb = async data => {
    const { error } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.OBSERVE,
      userLoginId: this.currentUser.username,
      eventDetail: {
        observationDate: data[OB_DAY_FIELD],
        observationPrice: String(Form2.getFieldValue(data[OB_PRICE_FIELD])),
      },
    });
    if (error) return;
    message.success('观察价格更新成功');
  };

  public isAutocallPhoenix = () => this.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX;

  public getColumnDefs = (): ITableColDef[] => {
    if (this.isAutocallPhoenix()) {
      return [
        {
          title: '观察日',
          dataIndex: OB_DAY_FIELD,
        },
        {
          title: '敲出障碍价',
          dataIndex: LEG_FIELD.UP_BARRIER,
          render: (val, record, index) =>
            this.state.upBarrierType === UP_BARRIER_TYPE_MAP.CNY
              ? formatMoney(val, { unit: '¥' })
              : `${formatMoney(val)} %`,
        },
        {
          title: 'Coupon障碍',
          dataIndex: LEG_FIELD.COUPON_BARRIER,
          render: (val, record, index) => `${formatMoney(val)} %`,
        },
        {
          title: '已观察到价格(可编辑)',
          dataIndex: OB_PRICE_FIELD,
          defaultEditing: false,
          editable: record => true,
          render: (val, record, index, { form, editing }) => (
            <FormItem>
              {form.getFieldDecorator({
                rules: [
                  {
                    message: '数值不能低于0',
                    validator: (rule, value, callback) => {
                      if (value < 0) {
                        return callback(true);
                      }
                      return callback();
                    },
                  },
                ],
              })(<UnitInputNumber autoSelect editing={editing} unit="¥" />)}
            </FormItem>
          ),
        },
        {
          title: '观察周期收益',
          dataIndex: OB_LIFE_PAYMENT,
          render: (val, record, index) => formatMoney(val, { unit: '¥' }),
        },
      ];
    }

    return [
      {
        title: '观察日',
        dataIndex: OB_DAY_FIELD,
      },
      ...(this.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RANGE_ACCRUALS
        ? []
        : [
            {
              title: '权重',
              dataIndex: 'weight',
            },
          ]),
      {
        title: '已观察到价格(可编辑)',
        dataIndex: OB_PRICE_FIELD,
        defaultEditing: false,
        editable: record => true,
        render: (val, record, index, { form, editing }) => (
          <FormItem>
            {form.getFieldDecorator({
              rules: [
                {
                  message: '数值不能低于0',
                  validator: (rule, value, callback) => {
                    if (value < 0) {
                      return callback(true);
                    }
                    return callback();
                  },
                },
              ],
            })(<UnitInputNumber autoSelect editing={editing} unit="¥" />)}
          </FormItem>
        ),
      },
    ];
  };

  public canBarrier = () =>
    this.state.tableData.some(record => {
      const alObPrice = Form2.getFieldValue(record[OB_PRICE_FIELD]);
      const upBarrier = record[LEG_FIELD.UP_BARRIER];
      const direction = this.data[LEG_FIELD.KNOCK_DIRECTION];
      const actUpBarrier =
        this.data[LEG_FIELD.UP_BARRIER_TYPE] === UNIT_ENUM_MAP2.PERCENT
          ? new BigNumber(upBarrier)
              .multipliedBy(0.01)
              .multipliedBy(this.data[LEG_FIELD.INITIAL_SPOT])
              .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
              .toNumber()
          : upBarrier;

      if (direction === KNOCK_DIRECTION_MAP.UP) {
        return alObPrice > actUpBarrier;
      }

      if (direction === KNOCK_DIRECTION_MAP.DOWN) {
        return alObPrice < actUpBarrier;
      }

      return false;
    });

  // 未发生敲出
  public notBarrierHappen = () => {
    const direction = this.data[LEG_FIELD.KNOCK_DIRECTION];
    const fixObservations = this.data[LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY];
    const last = fixObservations.every(item => _.isNumber(item[OB_PRICE_FIELD]));
    const expirationDate = getMoment(this.data[LEG_FIELD.EXPIRATION_DATE]);
    const now = moment();
    const expiration = expirationDate.isBefore(now, 'day') || expirationDate.isSame(now, 'day');
    return (
      last &&
      expiration &&
      this.state.tableData.every(record => {
        const upBarrier = record[LEG_FIELD.UP_BARRIER];
        const alObPrice = Form2.getFieldValue(record[OB_PRICE_FIELD]);
        const actUpBarrier =
          this.data[LEG_FIELD.UP_BARRIER_TYPE] === UNIT_ENUM_MAP2.PERCENT
            ? new BigNumber(upBarrier)
                .multipliedBy(0.01)
                .multipliedBy(this.data[LEG_FIELD.INITIAL_SPOT])
                .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
                .toNumber()
            : upBarrier;
        if (direction === KNOCK_DIRECTION_MAP.UP) {
          return alObPrice <= actUpBarrier;
        }
        if (direction === KNOCK_DIRECTION_MAP.DOWN) {
          return alObPrice >= actUpBarrier;
        }
        return false;
      })
    );
  };

  public getModalFooter = () => {
    if (this.isAutocallPhoenix()) {
      return (
        <Row type="flex" justify="start" align="middle">
          <Col>
            <Button
              disabled={!this.canBarrier()}
              style={{ marginLeft: VERTICAL_GUTTER }}
              onClick={this.onKnockOutConfirm}
              loading={this.state.modalConfirmLoading}
            >
              敲出
            </Button>
          </Col>
          <Col>
            <Button
              disabled={!this.notBarrierHappen()}
              style={{ marginLeft: VERTICAL_GUTTER }}
              onClick={this.onConfirm}
              loading={this.state.modalConfirmLoading}
            >
              结算
            </Button>
          </Col>
        </Row>
      );
    }
    return (
      <Row type="flex" justify="space-between" align="middle">
        {!isRangeAccruals(this.data) && (
          <Col>
            <Button
              disabled={!this.isCanExercise()}
              style={{ marginLeft: VERTICAL_GUTTER }}
              onClick={this.onAsianExerciseConfirm}
              loading={this.state.modalConfirmLoading}
            >
              行权
            </Button>
          </Col>
        )}
        <Col>
          <Tag style={{ marginLeft: VERTICAL_GUTTER }}>平均价: {this.state.avg}</Tag>
        </Col>
      </Row>
    );
  };

  public $asianExerciseModal: AsianExerciseModal;

  public $expirationModal: ExpirationModal;

  public $knockOutModal: KnockOutModal;

  public $exerciseForm: Form;

  public reload: any;

  public render() {
    const { visible } = this.state;
    return (
      <>
        <ExpirationModal
          ref={node => {
            this.$expirationModal = node;
          }}
        />
        <KnockOutModal
          ref={node => {
            this.$knockOutModal = node;
          }}
        />
        <AsianExerciseModal
          ref={node => {
            this.$asianExerciseModal = node;
          }}
        />
        <Modal
          onCancel={this.switchModal}
          destroyOnClose
          visible={visible}
          title="Fixing"
          footer={this.getModalFooter()}
          width={900}
        >
          <SmartTable
            pagination={false}
            dataSource={this.state.tableData}
            rowKey={OB_DAY_FIELD}
            onCellFieldsChange={this.onCellFieldsChanged}
            onCellEditingChanged={this.onCellValueChanged}
            columns={this.getColumnDefs()}
          />
        </Modal>
      </>
    );
  }
}

export default FixingModal;
