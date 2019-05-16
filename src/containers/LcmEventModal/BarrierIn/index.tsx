import {
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP,
  LCM_EVENT_TYPE_MAP,
  LEG_FIELD,
} from '@/constants/common';
import Form from '@/design/components/Form';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { message, Modal } from 'antd';
import { PureComponent } from 'react';
import { SETTLE_AMOUNT, UNDERLYER_PRICE } from './constants';

class BarrierIn extends PureComponent<
  {
    visible?: boolean;
    data?: any;
  },
  any
> {
  public $expirationFixedModal: Form;

  public $expirationCallModal: Form;

  public data: any = {};

  public tableFormData: any;

  public currentUser: any;

  public reload: any;

  public fixingTableData: any = [];

  public modal: any;

  public state = {
    visible: true,
    autoCallPaymentType: null,
    modalConfirmLoading: false,
    exportVisible: false,
    fixedDataSource: {},
    callPutDataSource: {},
    premiumType: null,
    formData: {},
  };

  public show = (data = {}, tableFormData, currentUser, reload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;

    this.modal = Modal.confirm({
      title: '确认敲入操作？',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: {
        loading: this.state.modalConfirmLoading,
      },
      visible: this.state.visible,
      onOk: this.onConfirm,
    });
  };

  public switchConfirmLoading = () => {
    this.modal.update({
      okButtonProps: {
        loading: !this.state.modalConfirmLoading,
      },
    });
  };

  public onConfirm = async () => {
    this.switchConfirmLoading();
    const { error } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.KNOCK_IN,
      userLoginId: this.currentUser.username,
      eventDetail: {},
    });
    this.switchConfirmLoading();
    if (error) return;
    message.success('敲入成功');
    this.setState({ visible: false });
    this.reload();
  };

  public render() {
    return null;
  }
}

export default BarrierIn;
