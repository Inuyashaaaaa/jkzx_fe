import { Col, message, Row, Popconfirm, Modal, Divider } from 'antd';
import React, { PureComponent } from 'react';
import PopconfirmButton from '@/containers/PopconfirmButton';
import ModalButton from '@/containers/ModalButton';
import { arr2treeOptions } from '@/tools';
import { queryCompanys, refSalesDelete, refSalesUpdate } from '@/services/sales';
import CreateFormModal from './CreateFormModal';
import { Form2 } from '@/containers';

class Operation extends PureComponent<{ record: any; fetchTable: any }> {
  public $refCreateFormModal: Form2 = null;

  public state = {
    visible: false,
    confirmLoading: false,
    editFormData: {},
    branchSalesList: [],
  };

  public componentDidMount = () => {
    this.setState({
      editFormData: {
        ...this.props.record,
        cascSubBranch: [this.props.record.subsidiaryId, this.props.record.branchId],
      },
    });
  };

  public switchModal = async () => {
    const { error, data } = await queryCompanys();
    if (error) return;
    const newData = arr2treeOptions(
      data,
      ['subsidiaryId', 'branchId'],
      ['subsidiaryName', 'branchName'],
    );
    const branchSalesList = newData.map(subsidiaryName => ({
      value: subsidiaryName.value,
      label: subsidiaryName.label,
      children: subsidiaryName.children.map(branchName => ({
        value: branchName.value,
        label: branchName.label,
      })),
    }));
    this.setState({
      visible: true,
      branchSalesList,
    });
  };

  public onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  public onEdit = async () => {
    const res = await this.$refCreateFormModal.validate();
    if (res.error) return;
    this.setState({
      confirmLoading: true,
      visible: false,
    });
    if (this.state.editFormData.cascSubBranch.length === 1) {
      message.error('必须存在营业部');
      return;
    }
    const { error, data } = await refSalesUpdate({
      salesId: this.props.record.uuid,
      branchId: this.state.editFormData.cascSubBranch[1],
      salesName: this.state.editFormData.salesName,
    });
    this.setState({
      confirmLoading: false,
    });
    if (error) {
      message.error('编辑失败');
      return;
    }
    this.props.fetchTable();
  };

  public handleValueChange = params => {
    this.setState({
      editFormData: params.values,
    });
  };

  public onRemove = async () => {
    const { error, data } = await refSalesDelete({
      salesId: this.props.record.uuid,
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
          title="编辑销售"
          visible={this.state.visible}
          onCancel={this.onCancel}
          onOk={this.onEdit}
          confirmLoading={this.state.confirmLoading}
        >
          <CreateFormModal
            refCreateFormModal={node => {
              this.$refCreateFormModal = node;
            }}
            dataSource={this.state.editFormData}
            handleValueChange={this.handleValueChange}
            branchSalesList={this.state.branchSalesList}
          />
        </Modal>
      </Row>
    );
  }
}

export default Operation;
