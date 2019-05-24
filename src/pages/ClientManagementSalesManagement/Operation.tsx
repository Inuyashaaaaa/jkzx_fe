import PopconfirmButton from '@/containers/PopconfirmButton';
import ModalButton from '@/containers/ModalButton';
import { arr2treeOptions } from '@/tools';
import { queryCompanys, refSalesDelete, refSalesUpdate } from '@/services/sales';
import { Col, message, Row, Popconfirm, Modal } from 'antd';
import React, { PureComponent } from 'react';
import CreateFormModal from './CreateFormModal';

class Operation extends PureComponent<{ record: any; fetchTable: any }> {
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
      ['subsidiaryName', 'branchName']
    );
    const branchSalesList = newData.map(subsidiaryName => {
      return {
        value: subsidiaryName.value,
        label: subsidiaryName.label,
        children: subsidiaryName.children.map(branchName => {
          return {
            value: branchName.value,
            label: branchName.label,
          };
        }),
      };
    });
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
    if (error) {
      message.error('编辑失败');
      return;
    }
    this.props.fetchTable();
    return;
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
            title="编辑销售"
            visible={this.state.visible}
            width={700}
            onCancel={this.onCancel}
            onOk={this.onEdit}
            confirmLoading={this.state.confirmLoading}
          >
            <CreateFormModal
              dataSource={this.state.editFormData}
              handleValueChange={this.handleValueChange}
              branchSalesList={this.state.branchSalesList}
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
