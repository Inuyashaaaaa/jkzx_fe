import React, { PureComponent } from 'react';
import Form from '@/containers/Form';
import { Modal, message } from 'antd';
import { LCM_EVENT_TYPE_MAP } from '@/constants/common';
import { trdTradeLCMEventProcess } from '@/services/trade-service';
import moment from 'moment';

class RollModal extends PureComponent<{ visible?: boolean; data?: any }> {
  public $rollForm: Form;

  public data: any;

  public tableFormData: any;

  public currentUser: any;

  public reload: any;

  public state = {
    visible: false,
    confirmLoading: false,
    formData: {},
  };

  public show = (data = {}, tableFormData, currentUser, reload) => {
    this.data = data;
    this.tableFormData = tableFormData;
    this.currentUser = currentUser;
    this.reload = reload;

    this.setState({
      visible: true,
    });
  };

  public switchModal = () => {
    this.setState({
      visible: false,
    });
  };

  public switchConfirmLoading = () => {
    this.setState({ confirmLoading: !this.state.confirmLoading });
  };

  public onConfirm = async () => {
    this.switchConfirmLoading();
    const { error, data } = await trdTradeLCMEventProcess({
      positionId: this.data.id,
      tradeId: this.tableFormData.tradeId,
      eventType: LCM_EVENT_TYPE_MAP.ROLL,
      userLoginId: this.currentUser.username,
      eventDetail: {
        expirationDate: this.state.formData.expirationDate
          ? this.state.formData.expirationDate.format('YYYY-MM-DD')
          : undefined,
      },
    });

    this.switchConfirmLoading();
    if (error) return;
    message.success('展期成功');
    this.reload();
    this.setState({
      visible: false,
    });
  };

  public onFormValueChange = params => {
    this.setState({
      formData: params.values,
    });
  };

  public render() {
    return (
      <>
        <Modal
          onCancel={this.switchModal}
          closeable={false}
          destroyOnClose={true}
          visible={this.state.visible}
          title={'展期'}
          onOk={this.onConfirm}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            dataSource={this.state.formData}
            onValueChange={this.onFormValueChange}
            controlNumberOneRow={1}
            footer={false}
            controls={[
              {
                field: 'expirationDate',
                control: {
                  label: '到期日',
                },
                decorator: {
                  rules: [
                    {
                      required: true,
                      message: '到期日是必填项',
                    },
                  ],
                },
                input: {
                  type: 'date',
                  range: 'date',
                  disabledDate: current => {
                    const startValue = this.data.expirationDate;
                    return current && current <= moment(startValue).endOf('day');
                  },
                },
              },
            ]}
          />
        </Modal>
      </>
    );
  }
}

export default RollModal;
