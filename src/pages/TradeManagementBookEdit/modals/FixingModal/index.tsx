import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  INPUT_NUMBER_PERCENTAGE_CONFIG,
  KNOCK_DIRECTION_MAP,
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  OB_DAY_FIELD,
} from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/design/components/Form';
import SourceTable from '@/design/components/SourceTable';
import { IColumnDef } from '@/design/components/Table/types';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { isRangeAccruals } from '@/tools';
import { Button, Col, message, Modal, Row, Tag } from 'antd';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { OB_LIFE_PAYMENT, OB_PRICE_FIELD } from '../../constants';
import { getObservertionFieldData } from '../../tools';
import { countAvg, filterObDays } from '../../utils';
import AsianExerciseModal from '../AsianExerciseModal';
import { NOTIONAL_AMOUNT, NUM_OF_OPTIONS, SETTLE_AMOUNT, UNDERLYER_PRICE } from './constants';

class FixingModal extends PureComponent<
  {
    visible?: boolean;
    data?: any;
  },
  any
> {
  public $asianExerciseModal: AsianExerciseModal;

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
    this.setState({
      visible: false,
    });
  };

  public onConfirm = async () => {
    if (this.$asianExerciseModal) {
      this.setState(
        {
          visible: false,
        },
        () => {
          this.$asianExerciseModal.show(
            this.data,
            this.tableFormData,
            this.currentUser,
            this.reload
          );
        }
      );
    }
  };

  public convertVisible = () => {
    this.setState({
      exportVisible: false,
    });
  };

  public isCanExercise = () => {
    const now = moment();
    // 今天是最后一个观察日
    const last = (_.last(this.state.tableData) || {}).day;
    if (
      (last && now.isSame(last, 'day')) ||
      now.isSame(this.data[LEG_FIELD.EXPIRATION_DATE], 'day')
    ) {
      return true;
    }

    if (this.state.tableData.every(item => !!item[OB_PRICE_FIELD])) {
      return true;
    }

    return false;
  };

  public countAvg = () => {
    return countAvg(this.state.tableData);
  };

  public onCellValueChanged = params => {
    if (params.colDef.field === OB_PRICE_FIELD && params.newValue !== params.oldValue) {
      this.startOb(params.data);
      this.setState({
        avg: this.countAvg(),
      });
    }
  };

  public startOb = async data => {
    const { error } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.OBSERVE,
      userLoginId: this.currentUser.userName,
      eventDetail: {
        observationDate: data.day,
        observationPrice: String(data[OB_PRICE_FIELD]),
      },
    });
    if (error) return;
    message.success('观察价格更新成功');
    this.reload();
  };

  public isAutocallPhoenix = () => {
    return (
      this.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX_ANNUAL ||
      this.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_PHOENIX_UNANNUAL
    );
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
          input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
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
      ...(this.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL ||
      this.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RANGE_ACCRUALS_UNANNUAL
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
      if (direction === KNOCK_DIRECTION_MAP.UP) {
        return alObPrice > upBarrier;
      }

      if (direction === KNOCK_DIRECTION_MAP.DOWN) {
        return alObPrice < upBarrier;
      }

      return false;
    });
  };

  // 未发生敲出
  public notBarrierHappen = () => {
    const direction = this.data[LEG_FIELD.KNOCK_DIRECTION];
    return this.state.tableData.every(record => {
      const upBarrier = record[LEG_FIELD.UP_BARRIER];
      const alObPrice = record[OB_PRICE_FIELD];
      if (direction === KNOCK_DIRECTION_MAP.UP) {
        return alObPrice <= upBarrier;
      }
      if (direction === KNOCK_DIRECTION_MAP.DOWN) {
        return alObPrice >= upBarrier;
      }
      return false;
    });
  };

  public getModalFooter = () => {
    if (this.isAutocallPhoenix()) {
      return (
        <Row type="flex" justify="start" align="middle">
          <Col>
            <Button
              disabled={!this.canBarrier()}
              style={{ marginLeft: VERTICAL_GUTTER }}
              onClick={this.onConfirm}
              loading={this.state.modalConfirmLoading}
            >
              敲出
            </Button>
          </Col>
          <Col>
            <Button
              disabled={!(this.isCanExercise() || this.notBarrierHappen())}
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
              onClick={this.onConfirm}
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
