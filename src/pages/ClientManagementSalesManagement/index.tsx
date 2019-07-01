/*eslint-disable */
import { Button, Col, Icon, message, Modal, Popconfirm, Row, Tree } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { PAGE_SIZE } from '@/constants/component';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, Input, Select, SmartTable } from '@/containers';
import ModalButton from '@/containers/ModalButton';
import Page from '@/containers/Page';
import {
  queryCompanys,
  querySalers,
  refBranchCreate,
  refBranchDelete,
  refBranchUpdate,
  refSalesCreate,
  refSubsidiaryCreate,
  refSubsidiaryDelete,
  refSubsidiaryUpdate,
} from '@/services/sales';
import { arr2treeOptions, getMoment } from '@/tools';
import CreateFormModal from './CreateFormModal';
import styles from './index.less';
import Operation from './Operation';

const { TreeNode } = Tree;

class ClientManagementSalesManagement extends PureComponent {
  public $subModalForm: Form2 = null;

  public $branchModalForm: Form2 = null;

  public $refCreateFormModal: Form2 = null;

  public state = {
    dataSource: [],
    loading: false,
    visible: false,
    confirmLoading: false,
    createFormData: {},
    treeNodeData: [],
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
      pageSize: PAGE_SIZE,
    },
    subList: [],
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

    const subData = arr2treeOptions(data, ['subsidiaryId'], ['subsidiaryName']);
    const subList = subData.map(subsidiaryName => ({
      value: subsidiaryName.value,
      label: subsidiaryName.label,
    }));

    const treeData = newData.map(item => ({
      title: item.label,
      key: item.value,
      children: item.children.map(branchName => ({
        title: branchName.label,
        key: `${item.label}/${item.value}/${branchName.value}`,
      })),
    }));
    this.setState({
      treeNodeData: treeData,
      branchSalesList,
      subList,
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
    this.setState(state => ({
      visible: !state.visible,
    }));
  };

  public onCreate = async () => {
    const res = await this.$refCreateFormModal.validate();
    if (res.error) return;
    this.setState({
      confirmLoading: true,
    });
    if (this.state.createFormData.cascSubBranch.length === 1) {
      message.error('必须存在营业部');
      return;
    }
    const { error, data } = await refSalesCreate({
      salesName: this.state.createFormData.salesName,
      branchId: this.state.createFormData.cascSubBranch[1],
    });
    this.setState({
      confirmLoading: false,
    });
    if (error) {
      message.error('创建失败');
      return;
    }
    message.success('创建成功');
    this.setState({
      visible: false,
      createFormData: {},
    });
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
        },
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
      },
    );
  };

  public onCancelRemove = item => e => {
    e.stopPropagation();
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
    message.success('删除成功');
    this.handleTreeNode();
  };

  public remove = e => {
    e.stopPropagation();
  };

  public onAdd = () => {
    this.setState(
      {
        editSub: false,
        subFormData: {},
      },
      () => {
        this.setState({
          subModalVisible: true,
        });
      },
    );
  };

  public onAddBranch = () => {
    this.setState(
      {
        editBranch: false,
        branchFormData: {},
      },
      () => {
        this.setState({
          branchModalVisible: true,
        });
      },
    );
  };

  public renderTreeNodes = data =>
    _.sortBy(data, 'title').map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={
              <div className={styles.listItem}>
                <span style={{ marginRight: '30px' }}>{item.title}</span>
                <span className={styles.icon}>
                  <Icon
                    type="edit"
                    // style={{ marginRight: '10px' }}
                    onClick={this.onEdit.bind(this, item)}
                  />
                  <Popconfirm
                    title="确认删除该分公司？"
                    onConfirm={this.bindRemove(item)}
                    okText="确认"
                    cancelText="取消"
                    onCancel={this.onCancelRemove(item)}
                  >
                    <Icon
                      type="minus-circle"
                      // style={{ marginRight: '10px' }}
                      onClick={this.remove.bind(this)}
                    />
                  </Popconfirm>
                </span>
              </div>
            }
            key={item.key}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={
            <div className={styles.listItem}>
              <span style={{ marginRight: '30px' }}>{item.title}</span>
              <span className={styles.icon}>
                <Icon
                  type="edit"
                  // style={{ marginRight: '10px' }}
                  onClick={this.onEdit.bind(this, item)}
                />
                <Popconfirm
                  title="确认删除该营业部？"
                  onConfirm={this.bindRemove(item)}
                  okText="确认"
                  cancelText="取消"
                  onCancel={this.onCancelRemove(item)}
                >
                  <Icon
                    type="minus-circle"
                    // style={{ marginRight: '10px' }}
                    onClick={this.remove.bind(this)}
                  />
                </Popconfirm>
              </span>
            </div>
          }
          key={item.key}
        />
      );
    });

  public onSelect = async selectedKeys => {
    console.log(selectedKeys);
    if (!selectedKeys.length) return;
    const arr = selectedKeys[0].split('/');
    this.setState({
      loading: true,
    });
    let salesRsp;
    if (arr.length === 3) {
      salesRsp = await querySalers({
        branchId: arr[2],
      });
    }
    if (arr.length === 1) {
      if (arr[0] === 'all') {
        salesRsp = await querySalers();
      } else {
        salesRsp = await querySalers({
          subsidiaryId: arr[0],
        });
      }
    }
    this.setState({
      loading: false,
    });
    if (salesRsp.error) return;
    this.setState({
      dataSource: salesRsp.data,
    });
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
    this.handleTreeNode();
    this.setState({
      subModalVisible: false,
    });
  };

  public handleConfirmBranch = async () => {
    const { error } = await this.$branchModalForm.validate();
    if (error) return;
    console.log(this.state.branchFormData);
    const branchEdit = this.state.editBranch ? refBranchUpdate : refBranchCreate;
    const params = this.state.editBranch
      ? {
          branchId: this.state.branchId,
          branchName: Form2.getFieldValue(this.state.branchFormData.branchName),
        }
      : {
          subsidiaryId: Form2.getFieldValue(this.state.branchFormData.subsidiaryName),
          branchName: Form2.getFieldValue(this.state.branchFormData.branchName),
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
      <Page title="销售管理">
        <Row type="flex" justify="space-between" gutter={24}>
          <Col xs={24} sm={6}>
            <Row style={{ marginBottom: VERTICAL_GUTTER }} type="flex" gutter={6}>
              <Col>
                <h3>分公司/营业部</h3>
              </Col>
              <Col>
                <Button onClick={this.onAdd} size="small" style={{ borderRadius: '4px' }}>
                  <Icon type="plus" />
                  分公司
                </Button>
              </Col>
              <Col>
                <Button onClick={this.onAddBranch} size="small" style={{ borderRadius: '4px' }}>
                  <Icon type="plus" />
                  营业部
                </Button>
              </Col>
            </Row>
            <Tree
              showLine
              onSelect={this.onSelect}
              blockNode={false}
              defaultExpandAll
              autoExpandParent
              defaultExpandParent
              defaultSelectedKeys={['all']}
            >
              <TreeNode key="all" title="全部">
                {this.renderTreeNodes(this.state.treeNodeData)}
              </TreeNode>
            </Tree>
          </Col>
          <Col xs={24} sm={18}>
            <Row type="flex" justify="space-between">
              <Col>
                <h3>销售列表</h3>
              </Col>
              <Col>
                <ModalButton
                  key="create"
                  style={{ marginBottom: VERTICAL_GUTTER }}
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
                      refCreateFormModal={node => {
                        this.$refCreateFormModal = node;
                      }}
                      dataSource={this.state.createFormData}
                      handleValueChange={this.handleValueChange}
                      branchSalesList={this.state.branchSalesList}
                    />
                  }
                >
                  新建销售
                </ModalButton>
              </Col>
            </Row>
            <SmartTable
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
                  render: (text, record, index) => getMoment(text).format('YYYY-MM-DD HH:mm:ss'),
                },
                {
                  title: '操作',
                  width: 250,
                  render: (text, record, index) => (
                    <Operation record={record} fetchTable={this.fetchTable} />
                  ),
                },
              ]}
              loading={this.state.loading}
              rowKey="uuid"
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
            ref={node => {
              this.$subModalForm = node;
            }}
            columnNumberOneRow={1}
            dataSource={this.state.subFormData}
            onFieldsChange={this.onSubFormChange}
            footer={false}
            columns={[
              {
                title: '分公司',
                dataIndex: 'subsidiaryName',
                render: (value, record, index, { form }) => (
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
                ),
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
            ref={node => {
              this.$branchModalForm = node;
            }}
            dataSource={this.state.branchFormData}
            onFieldsChange={this.onBranchFormChange}
            footer={false}
            columns={[
              {
                title: '分公司',
                dataIndex: 'subsidiaryName',
                render: (value, record, index, { form }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [
                        {
                          required: true,
                          message: '分公司名称必填',
                        },
                      ],
                    })(<Select options={this.state.subList} disabled={!!this.state.editBranch} />)}
                  </FormItem>
                ),
              },
              {
                title: '营业部',
                dataIndex: 'branchName',
                render: (value, record, index, { form }) => (
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
                ),
              },
            ]}
          />
        </Modal>
      </Page>
    );
  }
}

export default ClientManagementSalesManagement;
