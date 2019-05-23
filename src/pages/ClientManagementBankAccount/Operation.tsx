import PopconfirmButton from '@/containers/PopconfirmButton';
import ModalButton from '@/containers/ModalButton';
import { refBankAccountDel, refBankAccountSave } from '@/services/reference-data-service';
import { Col, message, Row } from 'antd';
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
      uuid: this.props.record.data.uuid,
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
          <ModalButton
            type="primary"
            key="edit"
            size="small"
            onClick={this.switchModal}
            modalProps={{
              visible: this.state.visible,
              confirmLoading: this.state.confirmLoading,
              onCancel: this.switchModal,
              onOk: this.handleEdit,
              title: '编辑银行账户',
            }}
            content={
              <CommonModalForm
                createFormData={this.state.createFormData}
                onCreateFormChange={this.onCreateFormChange}
              />
            }
          >
            编辑
          </ModalButton>
        </Col>
        <Col>
          <PopconfirmButton
            type="danger"
            size="small"
            popconfirmProps={{
              title: '确定要删除吗?',
              onConfirm: this.onRemove,
            }}
          >
            删除
          </PopconfirmButton>
        </Col>
      </Row>
    );
  }
}

export default Operation;
