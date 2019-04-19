import PopconfirmButton from '@/components/PopconfirmButton';
import ModalButton from '@/design/components/ModalButton';
import { Col, Row } from 'antd';
import React, { PureComponent } from 'react';
import CreateFormModal from './CreateFormModal';

class Operation extends PureComponent<{ record: any }> {
  public state = {
    visible: false,
    confirmLoading: false,
    editFormData: {},
  };

  public componentDidMount = () => {
    this.setState({
      editFormData: this.props.record,
    });
  };

  public switchModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  public onEdit = () => {
    this.setState({
      confirmLoading: true,
      visible: false,
    });
  };

  public handleValueChange = params => {
    this.setState({
      editFormData: params.values,
    });
  };

  public onRemove = () => {};

  public render() {
    return (
      <Row type="flex" justify="start">
        <Col>
          <ModalButton
            key="create"
            style={{ marginBottom: '20px' }}
            type="primary"
            size="small"
            onClick={this.switchModal}
            modalProps={{
              title: '新建销售',
              visible: this.state.visible,
              comfirmLoading: this.state.confirmLoading,
              onCancel: this.switchModal,
              onOk: this.onEdit,
            }}
            content={
              <CreateFormModal
                dataSource={this.state.editFormData}
                handleValueChange={this.handleValueChange}
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
