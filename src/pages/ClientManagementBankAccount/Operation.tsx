import { Divider, message, Modal, Popconfirm, Row } from 'antd';
import React, { PureComponent } from 'react';
import CommonModalForm from './CommonModalForm';
import { Form2 } from '@/containers';
import { refBankAccountDel, refBankAccountSave } from '@/services/reference-data-service';

class Operation extends PureComponent<{
  record: any;
  fetchTable: any;
}> {
  public $form: Form2 = null;

  public state = {
    visible: false,
    confirmLoading: false,
    createFormData: {},
  };

  public switchModal = () => {
    this.setState({ visible: true, createFormData: Form2.createFields(this.props.record) });
  };

  public handleEdit = async () => {
    const res = await this.$form.validate();
    if (res.error) return;

    this.setState({ confirmLoading: true });
    const { error, data } = await refBankAccountSave({
      uuid: this.props.record.uuid,
      ...Form2.getFieldsValue(this.state.createFormData),
    });
    this.setState({ confirmLoading: false });
    if (error) {
      message.error('更新失败');
      return;
    }
    this.setState({
      visible: false,
    });
    message.success('更新成功');
    this.props.fetchTable();
  };

  public onCreateFormChange = (props, changedFields, allFields) => {
    this.setState(state => ({
      createFormData: {
        ...state.createFormData,
        ...changedFields,
      },
    }));
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

  public hideModal = () => {
    this.setState({ visible: false });
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
          onCancel={this.hideModal}
          onOk={this.handleEdit}
          confirmLoading={this.state.confirmLoading}
        >
          <CommonModalForm
            refCreateFormModal={node => {
              this.$form = node;
            }}
            createFormData={this.state.createFormData}
            onCreateFormChange={this.onCreateFormChange}
          />
        </Modal>
      </Row>
    );
  }
}

export default Operation;
