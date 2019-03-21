import { LCM_EVENT_TYPE_MAP, LEG_FIELD } from '@/constants/common';
import Form from '@/design/components/Form';
import { tradeExercisePreSettle, trdTradeLCMEventProcess } from '@/services/trade-service';
import { Button, message, Modal } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import ExportModal from '../../ExportModal';
import {
  KNOCK_OUT_DATE,
  KNOCKOUT_FORM_CONTROLS,
  NOTIONAL_AMOUNT,
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
  public $knockOutModal: Form;

  public data: any;

  public tableFormData: any;

  public currentUser: any;

  public reload: any;

  public state = {
    visible: false,
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
      dataSource: {
        [NOTIONAL_AMOUNT]: this.data[LEG_FIELD.NOTIONAL_AMOUNT],
        [KNOCK_OUT_DATE]: moment(),
      },
    });
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
      eventType: LCM_EVENT_TYPE_MAP.KNOCK_OUT,
      userLoginId: this.currentUser.userName,
      eventDetail: {
        underlyerPrice: String(dataSource[UNDERLYER_PRICE]),
        settleAmount: String(dataSource[SETTLE_AMOUNT]),
        notionalAmount: String(dataSource[NOTIONAL_AMOUNT]),
        knockOutDate: dataSource[KNOCK_OUT_DATE].format('YYYY-MM-DD'),
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
        notionalAmount: String(dataSource[NOTIONAL_AMOUNT]),
        knockOutDate: dataSource[KNOCK_OUT_DATE].format('YYYY-MM-DD'),
      },
      eventType: LCM_EVENT_TYPE_MAP.KNOCK_OUT,
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
    const { visible } = this.state;
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
          title={'敲出 (雪球式)'}
        >
          <Form
            wrappedComponentRef={node => {
              this.$knockOutModal = node;
            }}
            dataSource={this.state.dataSource}
            onValueChange={this.onValueChange}
            controlNumberOneRow={1}
            footer={false}
            controls={KNOCKOUT_FORM_CONTROLS}
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
