import { LCM_EVENT_TYPE_MAP, LEG_FIELD, NOTIONAL_AMOUNT_TYPE_MAP } from '@/constants/common';
import Form from '@/design/components/Form';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { message, Modal } from 'antd';
import BigNumber from 'bignumber.js';
import React, { PureComponent } from 'react';
import ExportModal from '../../ExportModal';
import {
  EXERCISE_FORM_CONTROLS,
  NOTIONAL_AMOUNT,
  NUM_OF_OPTIONS,
  SETTLE_AMOUNT,
  UNDERLYER_PRICE,
} from './constants';

class ExerciseModal extends PureComponent<
  {
    visible?: boolean;
    data?: any;
  },
  any
> {
  public $exerciseForm: Form;

  public data: any;

  public tableFormData: any;

  public currentUser: any;

  public reload: any;

  public state = {
    visible: false,
    direction: 'BUYER',
    modalConfirmLoading: false,
    dataSource: {},
    exportVisible: false,
  };
  public show = (data = {}, tableFormData, currentUser, reload) => {
    console.log(data);
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;

    const direction = this.data.direction;

    this.setState(
      {
        visible: true,
        direction,
        ...(this.data.notionalAmountType === NOTIONAL_AMOUNT_TYPE_MAP.CNY
          ? {
              dataSource: this.computeLotDataSource({
                [NOTIONAL_AMOUNT]: this.data[LEG_FIELD.NOTIONAL_AMOUNT],
              }),
            }
          : {
              dataSource: this.computeCnyDataSource({
                [NUM_OF_OPTIONS]: this.data[LEG_FIELD.NOTIONAL_AMOUNT],
              }),
            }),
      },
      () => {
        console.log(this.state.direction);
      }
    );
  };

  public computeCnyDataSource = (value, changed = {}) => {
    return {
      ...value,
      [NOTIONAL_AMOUNT]: new BigNumber(value[NUM_OF_OPTIONS])
        .multipliedBy(this.data[LEG_FIELD.INITIAL_NOTIONAL_AMOUNT])
        .multipliedBy(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER]),
      [SETTLE_AMOUNT]: changed[SETTLE_AMOUNT]
        ? changed[SETTLE_AMOUNT]
        : new BigNumber(value[NUM_OF_OPTIONS]).multipliedBy(value[UNDERLYER_PRICE]).toNumber(),
    };
  };

  public computeLotDataSource = (value, changed = {}) => {
    return {
      ...value,
      [NUM_OF_OPTIONS]: new BigNumber(value[NOTIONAL_AMOUNT])
        .div(this.data[LEG_FIELD.INITIAL_NOTIONAL_AMOUNT])
        .div(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
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
    const { error, data } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.EXERCISE,
      userLoginId: this.currentUser.userName,
      eventDetail: {
        underlyerPrice: dataSource[UNDERLYER_PRICE],
        settleAmount: dataSource[SETTLE_AMOUNT],
        numOfOptions: dataSource[NUM_OF_OPTIONS],
        notionalAmount: dataSource[NOTIONAL_AMOUNT],
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

  public onValueChange = params => {
    this.setState({
      ...(this.data.notionalAmountType === NOTIONAL_AMOUNT_TYPE_MAP.CNY
        ? {
            dataSource: this.computeLotDataSource(
              params.values,
              params.changedValues.SETTLE_AMOUNT ? params.changedValues : {}
            ),
          }
        : {
            dataSource: this.computeCnyDataSource(
              params.values,
              params.changedValues.SETTLE_AMOUNT ? params.changedValues : {}
            ),
          }),
    });
  };

  public convertVisible = () => {
    this.setState({
      exportVisible: false,
    });
  };

  public render() {
    const { direction, visible } = this.state;
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
          title={direction === 'BUYER' ? '我方行权' : '客户行权'}
        >
          <Form
            wrappedComponentRef={node => {
              this.$exerciseForm = node;
            }}
            dataSource={this.state.dataSource}
            onValueChange={this.onValueChange}
            controlNumberOneRow={1}
            footer={false}
            controls={EXERCISE_FORM_CONTROLS}
          />
        </Modal>
      </>
    );
  }
}

export default ExerciseModal;
