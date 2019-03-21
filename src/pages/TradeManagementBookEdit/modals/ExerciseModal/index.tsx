import { LCM_EVENT_TYPE_MAP, LEG_FIELD, NOTIONAL_AMOUNT_TYPE_MAP } from '@/constants/common';
import Form from '@/design/components/Form';
import { tradeExercisePreSettle, trdTradeLCMEventProcess } from '@/services/trade-service';
import { Button, message, Modal } from 'antd';
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
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;

    const direction = this.data.direction;
    this.setState({
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
    });
  };

  // public getSettleAmount = async value => {
  //   const { error, data } = await tradeExercisePreSettle({
  //     positionId: this.data.id,
  //     eventDetail: {
  //       underlyerPrice: String(value[UNDERLYER_PRICE]),
  //       numOfOptions: String(value[NUM_OF_OPTIONS]),
  //       notionalAmount: String(value[NOTIONAL_AMOUNT]),
  //     },
  //   });
  //   if (error) return;
  //   this.setState({
  //     dataSource: {
  //       ...value,
  //       [SETTLE_AMOUNT]: data,
  //     },
  //   });
  // };

  public computeCnyDataSource = value => {
    const notionalAmount = new BigNumber(value[NUM_OF_OPTIONS])
      .multipliedBy(this.data[LEG_FIELD.INITIAL_SPOT])
      .multipliedBy(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
      .toNumber();
    return {
      ...value,
      [NOTIONAL_AMOUNT]: notionalAmount,
    };
  };

  public computeLotDataSource = value => {
    const numOfOptions = new BigNumber(value[NOTIONAL_AMOUNT])
      .div(this.data[LEG_FIELD.INITIAL_SPOT])
      .div(this.data[LEG_FIELD.UNDERLYER_MULTIPLIER])
      .toNumber();
    return {
      ...value,
      [NUM_OF_OPTIONS]: numOfOptions,
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

  public onValueChange = params => {
    this.setState({
      dataSource: params.values,
    });
  };

  public convertVisible = () => {
    this.setState({
      exportVisible: false,
    });
  };

  public handleSettleAmount = async () => {
    const dataSource = this.state.dataSource;
    const { error, data } = await tradeExercisePreSettle({
      positionId: this.data.id,
      eventDetail: {
        underlyerPrice: String(dataSource[UNDERLYER_PRICE]),
        numOfOptions: String(dataSource[NUM_OF_OPTIONS]),
        notionalAmount: String(dataSource[NOTIONAL_AMOUNT]),
      },
    });
    if (error) return;
    this.setState({
      dataSource: {
        ...dataSource,
        [SETTLE_AMOUNT]: data,
      },
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
          <Button key="upload" type="primary" onClick={this.handleSettleAmount}>
            结算
          </Button>
        </Modal>
      </>
    );
  }
}

export default ExerciseModal;
