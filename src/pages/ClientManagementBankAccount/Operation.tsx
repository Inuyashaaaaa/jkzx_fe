/*eslint-disable */
import { Divider, message, Modal, Popconfirm, Row } from 'antd';
import React, { PureComponent } from 'react';
import CommonModalForm from './CommonModalForm';
import { refBankAccountDel, refBankAccountSave } from '@/services/reference-data-service';

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
      createFormData: this.props.record,
    });
  };

  public switchModal = () => {
    this.setState(state => ({ visible: !state.visible }));
  };

  public handleEdit = async () => {
    this.setState({
      visible: false,
    });
    const { error, data } = await refBankAccountSave({
      uuid: this.props.record.uuid,
      ...this.state.createFormData,
    });
    if (error) {
      message.error('更新失败');
      return;
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
  };

  public render() {
    return (
      <Row>
        <a onClick={this.switchModal}>编辑</a>
        <Divider type="vertical" />
        <Popconfirm title="确定要删除吗?" onConfirm={this.onRemove}>
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
        <Modal
          title="编辑银行账户"
          visible={this.state.visible}
          onCancel={this.switchModal}
          onOk={this.handleEdit}
          confirmLoading={this.state.confirmLoading}
        >
          <CommonModalForm
            createFormData={this.state.createFormData}
            onCreateFormChange={this.onCreateFormChange}
          />
        </Modal>
      </Row>
    );
  }
}

export default Operation;
