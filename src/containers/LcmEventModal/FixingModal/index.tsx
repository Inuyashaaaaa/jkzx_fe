import {
  BIG_NUMBER_CONFIG,
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  INPUT_NUMBER_PERCENTAGE_CONFIG,
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
import Form from '@/design/components/Form';
import SourceTable from '@/design/components/SourceTable';
import { IColumnDef } from '@/design/components/Table/types';
import { OB_LIFE_PAYMENT, OB_PRICE_FIELD } from '../constants';
import { getObservertionFieldData } from '../tools';
import { countAvg, filterObDays } from '../utils';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { isAutocallPhoenix, isRangeAccruals } from '@/tools';
import { Button, Col, message, Modal, Row, Tag } from 'antd';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import AsianExerciseModal from '../AsianExerciseModal';
import ExpirationModal from '../ExpirationModal';
import KnockOutModal from '../KnockOutModal';
import { NOTIONAL_AMOUNT, NUM_OF_OPTIONS, SETTLE_AMOUNT, UNDERLYER_PRICE } from './constants';
import { getMoment } from '@/utils';

class FixingModal extends PureComponent<
  {
    visible?: boolean;
    data?: any;
  },
  any
> {
  public $asianExerciseModal: AsianExerciseModal;

  public $expirationModal: ExpirationModal;

  public $knockOutModal: KnockOutModal;

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
    tableData: [],
    avg: 0,
    upBarrierType: '',
  };

  public show = (data = {}, tableFormData, currentUser, reload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;
    const tableData = filterObDays(getObservertionFieldData(data));
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
      }
    );
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
    this.setState(
      {
        visible: false,
      },
      () => {
        this.reload();
      }
    );
  };

  public onConfirm = async () => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.$expirationModal.show(this.data, this.tableFormData, this.currentUser, this.reload);
      }
    );
  };

  public onAsianExerciseConfirm = async () => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.$asianExerciseModal.show(this.data, this.tableFormData, this.currentUser, this.reload);
      }
    );
  };

  public onKnockOutConfirm = async () => {
    this.setState(
      {
        visible: false,
      },
      () => {
        this.$knockOutModal.show(this.data, this.tableFormData, this.currentUser, this.reload);
      }
    );
  };

  public convertVisible = () => {
    this.setState({
      exportVisible: false,
    });
  };

  public isCanExercise = () => {
    const now = moment();
    // 今天是最后一个观察日
    const last = getMoment(_.get(_.last(this.state.tableData) || {}, [OB_DAY_FIELD]));
    const expirationDate = getMoment(this.data[LEG_FIELD.EXPIRATION_DATE]);
    if (
      ((last && (last.isBefore(now, 'day') || now.isSame(last, 'day'))) ||
        (expirationDate &&
          (expirationDate.isBefore(now, 'days') || now.isSame(expirationDate, 'day')))) &&
      this.state.tableData.every(item => _.isNumber(item[OB_PRICE_FIELD]))
    ) {
      return true;
    }
    return false;
  };

  public countAvg = () => {
    return countAvg(this.state.tableData);
  };

  public onCellValueChanged = params => {
    if (
      params.colDef.field === OB_PRICE_FIELD &&
      params.newValue &&
      params.newValue !== params.oldValue
    ) {
      this.startOb(params.data);
    }
    if (this.isAutocallPhoenix()) {
      this.data = {
        ...this.data,
        [LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY]: this.data[
          LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY
        ].map(item => {
          if (item[OB_DAY_FIELD] === params.data[OB_DAY_FIELD]) {
            return {
              [OB_DAY_FIELD]: params.data[OB_DAY_FIELD],
              [OB_PRICE_FIELD]: params.data[OB_PRICE_FIELD],
            };
          }
          return item;
        }),
      };
    }
    const tableData = filterObDays(getObservertionFieldData(this.data));
    this.setState(
      {
        tableData,
      },
      () => {
        this.setState({
          avg: this.countAvg(),
        });
      }
    );
  };

  public startOb = async data => {
    const { error } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.OBSERVE,
      userLoginId: this.currentUser.userName,
      eventDetail: {
        observationDate: data[OB_DAY_FIELD],
        observationPrice: String(data[OB_PRICE_FIELD]),
      },
    });
    if (error) return;
    message.success('观察价格更新成功');
  };

  public isAutocallPhoenix = () => {
    return this.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX;
  };

  public getColumnDefs = (): IColumnDef[] => {
    if (this.isAutocallPhoenix()) {
      return [
        {
          headerName: '观察日',
          field: OB_DAY_FIELD,
          input: {
            type: 'date',
          },
        },
        {
          headerName: '敲出障碍价',
          field: LEG_FIELD.UP_BARRIER,
          input:
            this.state.upBarrierType === UP_BARRIER_TYPE_MAP.CNY
              ? INPUT_NUMBER_CURRENCY_CNY_CONFIG
              : INPUT_NUMBER_PERCENTAGE_CONFIG,
        },
        {
          headerName: 'Coupon障碍',
          field: LEG_FIELD.COUPON_BARRIER,
          input: INPUT_NUMBER_PERCENTAGE_CONFIG,
        },
        {
          headerName: '已观察到价格(可编辑)',
          field: OB_PRICE_FIELD,
          editable: true,
          input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
          rules: [
            {
              message: '数值不能低于0',
              validator: (rule, value, callback) => {
                if (value < 0) {
                  return callback(true);
                }
                callback();
              },
            },
          ],
        },
        {
          headerName: '观察周期收益',
          field: OB_LIFE_PAYMENT,
          input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
        },
      ];
    }

    return [
      {
        headerName: '观察日',
        field: OB_DAY_FIELD,
        input: {
          type: 'date',
        },
      },
      ...(this.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RANGE_ACCRUALS
        ? []
        : [
            {
              headerName: '权重',
              field: 'weight',
              input: INPUT_NUMBER_DIGITAL_CONFIG,
            },
          ]),
      {
        headerName: '已观察到价格(可编辑)',
        field: OB_PRICE_FIELD,
        editable: true,
        input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
        rules: [
          {
            message: '数值不能低于0',
            validator: (rule, value, callback) => {
              if (value < 0) {
                return callback(true);
              }
              callback();
            },
          },
        ],
      },
    ];
  };

  public canBarrier = () => {
    return this.state.tableData.some(record => {
      const alObPrice = record[OB_PRICE_FIELD];
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
  };

  // 未发生敲出
  public notBarrierHappen = () => {
    const direction = this.data[LEG_FIELD.KNOCK_DIRECTION];
    const fixObservations = this.data[LEG_FIELD.EXPIRE_NO_BARRIEROBSERVE_DAY];
    const last = fixObservations.every(item => {
      return _.isNumber(item[OB_PRICE_FIELD]);
    });
    return (
      last &&
      this.state.tableData.every(record => {
        const upBarrier = record[LEG_FIELD.UP_BARRIER];
        const alObPrice = record[OB_PRICE_FIELD];
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
              到期
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

  public render() {
    const { visible } = this.state;
    return (
      <>
        <ExpirationModal ref={node => (this.$expirationModal = node)} />
        <KnockOutModal ref={node => (this.$knockOutModal = node)} />
        <AsianExerciseModal ref={node => (this.$asianExerciseModal = node)} />
        <Modal
          onCancel={this.switchModal}
          destroyOnClose={true}
          visible={visible}
          title={'Fixing'}
          footer={this.getModalFooter()}
          width={900}
        >
          <SourceTable
            pagination={false}
            dataSource={this.state.tableData}
            rowKey={OB_DAY_FIELD}
            onCellValueChanged={this.onCellValueChanged}
            columnDefs={this.getColumnDefs()}
          />
        </Modal>
      </>
    );
  }
}

export default FixingModal;
