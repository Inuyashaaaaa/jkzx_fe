import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
} from '@/constants/common';
import { VERTICAL_GUTTER } from '@/constants/global';
import Form from '@/design/components/Form';
import SourceTable from '@/design/components/SourceTable';
import { convertObservetions } from '@/services/common';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { getMoment } from '@/utils';
import { Button, Col, message, Modal, Row, Tag } from 'antd';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
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

    this.setState(
      {
        tableData: filterObDays(convertObservetions(data)),
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

    if (this.state.tableData.every(item => !!item.price)) {
      return true;
    }

    return false;
  };

  public countAvg = () => {
    return countAvg(this.state.tableData);
  };

  public onCellValueChanged = params => {
    if (params.colDef.field === 'price' && params.newValue !== params.oldValue) {
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
        observationPrice: String(data.price),
      },
    });
    if (error) return;
    message.success('观察价格更新成功');
    this.reload();
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
          footer={
            <Row type="flex" justify="space-between" align="middle">
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
              <Col>
                <Tag style={{ marginLeft: VERTICAL_GUTTER }}>平均价: {this.state.avg}</Tag>
              </Col>
            </Row>
          }
        >
          <SourceTable
            pagination={false}
            dataSource={this.state.tableData}
            rowKey="day"
            onCellValueChanged={this.onCellValueChanged}
            columnDefs={[
              {
                headerName: '观察日',
                field: 'day',
                input: {
                  type: 'date',
                },
              },
              {
                headerName: '权重',
                field: 'weight',
                input: INPUT_NUMBER_DIGITAL_CONFIG,
              },
              {
                headerName: '已观察到价格(可编辑)',
                field: 'price',
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
            ]}
          />
        </Modal>
      </>
    );
  }
}

export default FixingModal;
