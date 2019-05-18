import {
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_ZHCH_MAP,
} from '@/constants/common';
import CashExportModal from '@/containers/CashExportModal';
import Form from '@/components/Form';
import { tradeExercisePreSettle, trdTradeLCMEventProcess } from '@/services/trade-service';
import { getMoment } from '@/utils';
import { Alert, message, Modal } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
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

  public data: any = {};

  public tableFormData: any;

  public currentUser: any;

  public reload: any;

  public state = {
    visible: false,
    modalConfirmLoading: false,
    dataSource: {},
    exportVisible: false,
    notionalType: null,
  };

  public getInitialKnockOutDate = data => {
    const dateVals = (data.observationDates || [])
      .map(item => getMoment(item).valueOf())
      .sort((a, b) => a - b);
    const now = moment().valueOf();
    if (!dateVals.length) return moment(now);
    if (now < dateVals[0]) {
      return moment(dateVals[0]);
    }
    if (now > dateVals[dateVals.length - 1]) {
      return moment(dateVals[dateVals.length - 1]);
    }
    return moment(now);
  };

  public show = (data = {}, tableFormData, currentUser, reload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;
    this.setState({
      visible: true,
      notionalType: this.data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE],
      dataSource: {
        [NOTIONAL_AMOUNT]: this.data[LEG_FIELD.NOTIONAL_AMOUNT],
        [KNOCK_OUT_DATE]: this.getInitialKnockOutDate(this.data),
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
    const rsp = await this.$knockOutModal.validate();
    if (rsp.error) return;
    const dataSource = this.state.dataSource;
    this.switchConfirmLoading();
    const { error, data } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.KNOCK_OUT,
      userLoginId: this.currentUser.username,
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
    if (!dataSource[UNDERLYER_PRICE]) {
      if (!(dataSource[UNDERLYER_PRICE] === 0)) {
        message.error('请填标的物价格');
        return;
      }
    }
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
        <CashExportModal
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
          title={`敲出 (${LEG_TYPE_ZHCH_MAP[this.data[LEG_TYPE_FIELD]]})`}
        >
          <Form
            ref={node => {
              this.$knockOutModal = node;
            }}
            dataSource={this.state.dataSource}
            onValueChange={this.onValueChange}
            controlNumberOneRow={1}
            footer={false}
            controls={KNOCKOUT_FORM_CONTROLS(this.state.notionalType, this.handleSettleAmount)}
          />
          <Alert message="结算金额为正时代表我方收入，金额为负时代表我方支出。" type="info" />
        </Modal>
      </>
    );
  }
}

export default ExerciseModal;
