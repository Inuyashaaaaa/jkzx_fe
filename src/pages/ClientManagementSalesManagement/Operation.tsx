import PopconfirmButton from '@/components/PopconfirmButton';
import ModalButton from '@/design/components/ModalButton';
import { arr2treeOptions } from '@/lib/utils';
import { queryCompanys, refSalesDelete, refSalesUpdate } from '@/services/sales';
import { Col, message, Row } from 'antd';
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
          <ModalButton
            key="create"
            style={{ marginBottom: '20px' }}
            type="primary"
            size="small"
            onClick={this.switchModal}
            modalProps={{
              title: '编辑销售',
              visible: this.state.visible,
              comfirmLoading: this.state.confirmLoading,
              onCancel: this.onCancel,
              onOk: this.onEdit,
            }}
            content={
              <CreateFormModal
                dataSource={this.state.editFormData}
                handleValueChange={this.handleValueChange}
                branchSalesList={this.state.branchSalesList}
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
