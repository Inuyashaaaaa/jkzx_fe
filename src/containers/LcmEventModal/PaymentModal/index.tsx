import { Alert, message, Modal } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { LCM_EVENT_TYPE_MAP } from '@/constants/common';
import { Form2 } from '@/containers';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import { EXERCISE_FORM_CONTROLS } from './constants';
import CashExportModal from '@/containers/CashExportModal';

class PaymentModal extends PureComponent<
  {
    visible?: boolean;
    data?: any;
  },
  any
> {
  public data: any = {};

  public state = {
    visible: false,
    modalConfirmLoading: false,
    exportVisible: false,
    dataSource: {},
  };

  public show = (data = {}, tableFormData, currentUser, reload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;
    this.setState({
      visible: true,
      dataSource: Form2.createFields({
        paymentDate: moment(),
      }),
    });
  };

  public switchConfirmLoading = () => {
    this.setState(state => ({ modalConfirmLoading: !state.modalConfirmLoading }));
  };

  public switchModal = () => {
    this.setState({
      visible: false,
    });
  };

  public onConfirm = async () => {
    const rsp = await this.$paymentModal.validate();
    if (rsp.error) return;
    const dataSource = Form2.getFieldsValue(this.state.dataSource);
    this.switchConfirmLoading();
    const { error } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.PAYMENT,
      userLoginId: this.currentUser.username,
      eventDetail: {
        paymentDate: dataSource.paymentDate.format('YYYY-MM-DD'),
        cashFlow: String(dataSource.cashFlow),
      },
    });

    this.switchConfirmLoading();
    if (error) return;
    message.success('支付成功');
    this.setState({
      visible: false,
      exportVisible: true,
    });
  };

  public onValueChange = (props, changedFields, allFields) => {
    this.setState(state => ({
      dataSource: {
        ...state.dataSource,
        ...changedFields,
      },
    }));
  };

  public convertVisible = () => {
    this.setState({
      exportVisible: false,
    });
  };

  public $paymentModal: Form2;

  public tableFormData: any;

  public currentUser: any;

  public reload: any;

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
          maskClosable={false}
          visible={visible}
          confirmLoading={this.state.modalConfirmLoading}
          title="支付"
        >
          <Form2
            ref={node => {
              this.$paymentModal = node;
            }}
            dataSource={this.state.dataSource}
            onFieldsChange={this.onValueChange}
            footer={false}
            columns={EXERCISE_FORM_CONTROLS}
          />
          <Alert message="结算金额为正时代表我方收入，金额为负时代表我方支出。" type="info" />
        </Modal>
      </>
    );
  }
}

export default PaymentModal;
