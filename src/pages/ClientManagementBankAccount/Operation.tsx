import PopconfirmButton from '@/containers/PopconfirmButton';
import ModalButton from '@/containers/ModalButton';
import { refBankAccountDel, refBankAccountSave } from '@/services/reference-data-service';
import { Col, message, Row, Modal, Popconfirm } from 'antd';
import React, { PureComponent } from 'react';
import CommonModalForm from './CommonModalForm';

class Operation extends PureComponent<{
  record: any;
  fetchTable: any;
}> {
  public state = {
    visible: false,
    confirmLoading: false,
    createFormData: {},
  };

  public componentDidMount = () => {
    this.setState({
      createFormData: this.props.record.data,
    });
  };

  public switchModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  public handleEdit = async () => {
    this.setState({
      visible: false,
    });
    const { error, data } = await refBankAccountSave({
      uuid: this.props.record.data.uuid,
      ...this.state.createFormData,
    });
    if (error) {
      message.error('更新失败');
      return false;
    }
    message.success('更新成功');
    this.props.fetchTable();
  };

  public onCreateFormChange = params => {
    this.setState({
      createFormData: params.values,
    });
  };

  public onRemove = async () => {
    const { error, data } = await refBankAccountDel({
      uuid: this.props.record.uuid,
    });
    if (error) {
      message.error('删除失败');
      return;
    }
    message.success('删除成功');
    this.props.fetchTable();
    return;
  };

  public render() {
    return (
      <Row type="flex" justify="start">
        <Col>
          <a onClick={this.switchModal} style={{ marginRight: 10 }}>
            编辑
          </a>
          <Modal
            title="编辑银行账户"
            visible={this.state.visible}
            width={700}
            onCancel={this.switchModal}
            onOk={this.handleEdit}
            confirmLoading={this.state.confirmLoading}
          >
            <CommonModalForm
              createFormData={this.state.createFormData}
              onCreateFormChange={this.onCreateFormChange}
            />
          </Modal>
        </Col>
        <Col>
          <Popconfirm title="确定要删除吗?" onConfirm={this.onRemove}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Col>
      </Row>
    );
  }
}

export default Operation;
