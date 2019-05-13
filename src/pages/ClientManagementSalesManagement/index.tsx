import { Form2, Input } from '@/design/components';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { arr2treeOptions } from '@/lib/utils';
import {
  queryCompanys,
  querySalers,
  refBranchCreate,
  refBranchDelete,
  refBranchUpdate,
  refSalesCreate,
  refSalesDelete,
  refSalesUpdate,
  refSubsidiaryCreate,
  refSubsidiaryDelete,
  refSubsidiaryUpdate,
} from '@/services/sales';
import { Col, Icon, message, Modal, Popconfirm, Row, Tree, Table, Divider } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { PureComponent } from 'react';
import { TABLE_COL_DEF } from './constants';
import CreateFormModal from './CreateFormModal';
import Operation from './Operation';
import { getMoment } from '@/utils';

const { TreeNode } = Tree;

class ClientManagementSalesManagement extends PureComponent {
  public $subModalForm: Form2 = null;
  public $branchModalForm: Form2 = null;

  public $sourceTable: SourceTable = null;

  public state = {
    dataSource: [],
    loading: false,
    visible: false,
    confirmLoading: false,
    createFormData: {},
    treeNodeData: [],
    key: '',
    editable: false,
    subModalVisible: false,
    branchModalVisible: false,
    subFormData: {},
    branchFormData: {},
    branchSalesList: [],
    editSub: true,
    editBranch: true,
    branchId: '',
    subsidiaryId: '',
    pagination: {
      current: 1,
      pageSize: 10,
    },
  };

  public componentDidMount = () => {
    this.fetchTable();
    this.handleTreeNode();
  };

  public handleTreeNode = async () => {
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

    const treeData = newData.map(item => {
      return {
        title: item.label,
        key: item.value,
        children: item.children.map(branchName => {
          return {
            title: branchName.label,
            key: item.label + '/' + item.value + '/' + branchName.value,
          };
        }),
      };
    });
    this.setState({
      treeNodeData: treeData,
      branchSalesList,
    });
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const { error, data } = await querySalers();
    this.setState({
      loading: false,
    });
    if (error) return;
    this.setState({
      dataSource: data,
    });
  };

  public switchModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  public onCreate = async () => {
    this.setState({
      confirmLoading: true,
      visible: false,
    });
    if (this.state.createFormData.cascSubBranch.length === 1) {
      message.error('必须存在营业部');
      return;
    }
    const { error, data } = await refSalesCreate({
      salesName: this.state.createFormData.salesName,
      branchId: this.state.createFormData.cascSubBranch[1],
    });
    if (error) {
      message.error('创建失败');
      return;
    }
    message.success('创建成功');
    this.handleTreeNode();
    this.fetchTable();
  };

  public handleValueChange = params => {
    this.setState({
      createFormData: params.values,
    });
  };

  public onEdit = (params, e) => {
    e.stopPropagation();
    console.log(params);
    if (params.children) {
      return this.setState(
        {
          editSub: true,
          subsidiaryId: params.key,
          subFormData: {
            subsidiaryName: {
              type: 'field',
              value: params.title,
            },
          },
        },
        () => {
          this.setState({
            subModalVisible: true,
          });
        }
      );
    }
    return this.setState(
      {
        editBranch: true,
        branchId: params.key.split('/')[2],
        branchFormData: {
          subsidiaryName: {
            type: 'field',
            value: params.key.split('/')[0],
          },
          branchName: {
            type: 'field',
            value: params.title,
          },
        },
      },
      () => {
        this.setState({
          branchModalVisible: true,
        });
      }
    );
  };

  // 未完成remove
  public bindRemove = item => async e => {
    e.stopPropagation();
    const deleteEdit = item.children ? refSubsidiaryDelete : refBranchDelete;
    const params = item.children
      ? {
          subsidiaryId: item.key,
        }
      : {
          branchId: item.key.split('/')[2],
        };
    const { error, data } = await deleteEdit({
      ...params,
    });
    if (error) {
      message.error('删除失败');
      return;
    }
    this.handleTreeNode();
  };

  public remove = e => {
    e.stopPropagation();
  };

  public onAdd = (params, e) => {
    e.stopPropagation();
    if (params.children) {
      return this.setState(
        {
          editSub: false,
          subFormData: {},
        },
        () => {
          this.setState({
            subModalVisible: true,
          });
        }
      );
    }
    return this.setState(
      {
        subsidiaryId: params.key.split('/')[1],
        editBranch: false,
        branchFormData: {
          subsidiaryName: {
            type: 'field',
            value: params.key.split('/')[0],
          },
        },
      },
      () => {
        this.setState({
          branchModalVisible: true,
        });
      }
    );
  };

  public renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={
              <>
                <span style={{ marginRight: '30px' }}>{item.title}</span>
                <span>
                  <Icon
                    type="edit"
                    style={{ marginRight: '10px' }}
                    onClick={this.onEdit.bind(this, item)}
                  />
                  <Icon
                    type="plus-circle"
                    style={{ marginRight: '10px' }}
                    onClick={this.onAdd.bind(this, item)}
                  />
                  <Popconfirm
                    title="确认删除该分公司？"
                    onConfirm={this.bindRemove(item)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Icon
                      type="minus-circle"
                      style={{ marginRight: '10px' }}
                      onClick={this.remove.bind(this)}
                    />
                  </Popconfirm>
                </span>
              </>
            }
            key={item.key}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={
            <>
              <span style={{ marginRight: '30px' }}>{item.title}</span>
              <span>
                <Icon
                  type="edit"
                  style={{ marginRight: '10px' }}
                  onClick={this.onEdit.bind(this, item)}
                />
                <Icon
                  type="plus-circle"
                  style={{ marginRight: '10px' }}
                  onClick={this.onAdd.bind(this, item)}
                />
                <Popconfirm
                  title="确认删除该营业部？"
                  onConfirm={this.bindRemove(item)}
                  okText="确认"
                  cancelText="取消"
                >
                  <Icon
                    type="minus-circle"
                    style={{ marginRight: '10px' }}
                    onClick={this.remove.bind(this)}
                  />
                </Popconfirm>
              </span>
            </>
          }
          key={item.key}
          dataRef={item}
        />
      );
    });
  };

  public onSelect = async selectedKeys => {
    console.log(selectedKeys);
    if (!selectedKeys.length) return;
    const arr = selectedKeys[0].split('/');
    if (arr.length === 3) {
      this.setState({
        loading: true,
      });
      const { error, data } = await querySalers({
        branchId: arr[2],
      });
      this.setState({
        loading: false,
      });
      if (error) return;
      return this.setState({
        dataSource: data,
      });
    }
  };

  public handleCancelSub = () => {
    this.setState({
      subModalVisible: false,
      subFormData: {},
    });
  };

  public handleCancelBranch = () => {
    this.setState({
      branchModalVisible: false,
      branchFormData: {},
    });
  };

  // 未完成后端编辑接口
  public handleConfirmSub = async () => {
    const { error } = await this.$subModalForm.validate();
    if (error) return;
    console.log(this.state.subFormData);
    const subsidiaryEdit = this.state.editSub ? refSubsidiaryUpdate : refSubsidiaryCreate;
    const params = this.state.editSub
      ? {
          subsidiaryId: this.state.subsidiaryId,
          subsidiaryName: this.state.subFormData.subsidiaryName.value,
        }
      : { subsidiaryName: this.state.subFormData.subsidiaryName.value };
    const { error: _error, data: _data } = await subsidiaryEdit({
      ...params,
    });
    if (_error) {
      message.error(this.state.editSub ? '更新失败' : '创建失败');
      return;
    }
    // 在创建分公司时，自动在分公司下创建一个同名的运营部。
    if (!_data.branchId) {
      const { data: bdata, error: berror } = await refBranchCreate({
        subsidiaryId: _data.subsidiaryId,
        branchName: this.state.subFormData.subsidiaryName.value,
      });
      if (berror) {
        message.error('分公司下创建同名的运营部失败');
      }
    }
    this.handleTreeNode();
    this.setState({
      subModalVisible: false,
    });
  };

  // 未完成后端编辑接口
  public handleConfirmBranch = async () => {
    const { error } = await this.$branchModalForm.validate();
    if (error) return;
    const branchEdit = this.state.editBranch ? refBranchUpdate : refBranchCreate;
    const params = this.state.editBranch
      ? {
          branchId: this.state.branchId,
          branchName: this.state.branchFormData.branchName.value,
        }
      : {
          subsidiaryId: this.state.subsidiaryId,
          branchName: this.state.branchFormData.branchName.value,
        };
    const { error: _error, data: _data } = await branchEdit({
      ...params,
    });
    if (_error) {
      message.error(this.state.branchEdit ? '更新失败' : '创建失败');
      return;
    }
    this.handleTreeNode();
    this.setState({
      branchModalVisible: false,
    });
  };

  public onSubFormChange = (props, changedFields, allFields) => {
    this.setState({
      subFormData: allFields,
    });
  };

  public onBranchFormChange = (props, changedFields, allFields) => {
    this.setState({
      branchFormData: allFields,
    });
  };

  public paginationChange = (current, pageSize) => {
    this.setState({
      pagination: {
        current,
        pageSize,
      },
    });
  };

  public render() {
    return (
      <PageHeaderWrapper title="销售管理">
        <Row type="flex" justify="space-between" gutter={32}>
          <Col>
            <Tree showLine={true} onSelect={this.onSelect} blockNode={false}>
              {this.renderTreeNodes(this.state.treeNodeData)}
            </Tree>
          </Col>
          <Col>
            <ModalButton
              key="create"
              style={{ marginBottom: '20px' }}
              type="primary"
              onClick={this.switchModal}
              modalProps={{
                title: '新建销售',
                visible: this.state.visible,
                comfirmLoading: this.state.confirmLoading,
                onCancel: this.switchModal,
                onOk: this.onCreate,
              }}
              content={
                <CreateFormModal
                  dataSource={this.state.createFormData}
                  handleValueChange={this.handleValueChange}
                  branchSalesList={this.state.branchSalesList}
                />
              }
            >
              新建销售
            </ModalButton>
            <Divider type="horizontal" />
            <Table
              dataSource={this.state.dataSource}
              columns={[
                {
                  title: '销售',
                  dataIndex: 'salesName',
                  width: 200,
                },
                {
                  title: '营业部',
                  width: 200,
                  dataIndex: 'branchName',
                },
                {
                  title: '分公司',
                  width: 200,
                  dataIndex: 'subsidiaryName',
                },
                {
                  title: '创建时间',
                  width: 250,
                  dataIndex: 'createdAt',
                  render: (text, record, index) => {
                    return getMoment(text).format('YYYY-MM-DD HH:mm:ss');
                  },
                },
                {
                  title: '操作',
                  width: 250,
                  render: (text, record, index) => {
                    return <Operation record={text} fetchTable={this.fetchTable} />;
                  },
                },
              ]}
              loading={this.state.loading}
              rowKey="uuid"
              size="middle"
              pagination={{
                ...this.state.pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.paginationChange,
              }}
            />
          </Col>
        </Row>
        <Modal
          title={this.state.editSub ? '更新分公司' : '创建分公司'}
          visible={this.state.subModalVisible}
          onCancel={this.handleCancelSub}
          onOk={this.handleConfirmSub}
        >
          <Form2
            ref={node => (this.$subModalForm = node)}
            columnNumberOneRow={1}
            dataSource={this.state.subFormData}
            onFieldsChange={this.onSubFormChange}
            footer={false}
            columns={[
              {
                title: '分公司',
                dataIndex: 'subsidiaryName',
                render: (value, record, index, { form }) => {
                  return (
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                      {form.getFieldDecorator({
                        rules: [
                          {
                            required: true,
                            message: '分公司名称必填',
                          },
                        ],
                      })(<Input placeholder="请输入分公司名称" />)}
                    </FormItem>
                  );
                },
              },
            ]}
          />
        </Modal>
        <Modal
          title={this.state.editBranch ? '更新营业部' : '创建营业部'}
          visible={this.state.branchModalVisible}
          onCancel={this.handleCancelBranch}
          onOk={this.handleConfirmBranch}
        >
          <Form2
            ref={node => (this.$branchModalForm = node)}
            dataSource={this.state.branchFormData}
            onFieldsChange={this.onBranchFormChange}
            footer={false}
            columns={[
              {
                title: '分公司',
                dataIndex: 'subsidiaryName',
                render: (value, record, index, { form }) => {
                  return (
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [
                          {
                            required: true,
                            message: '分公司名称必填',
                          },
                        ],
                      })(<Input disabled={true} />)}
                    </FormItem>
                  );
                },
              },
              {
                title: '营业部',
                dataIndex: 'branchName',
                render: (value, record, index, { form }) => {
                  return (
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [
                          {
                            required: true,
                            message: '营业部名称必填',
                          },
                        ],
                      })(<Input placeholder="请输入营业部名称" />)}
                    </FormItem>
                  );
                },
              },
            ]}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ClientManagementSalesManagement;
