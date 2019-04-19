import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { arr2treeOptions, delay, mockData } from '@/lib/utils';
import { queryCompanys, querySalers } from '@/services/sales';
import { Col, Icon, Modal, Popconfirm, Row, Tree } from 'antd';
import React, { PureComponent } from 'react';
import { TABLE_COL_DEF } from './constants';
import CreateFormModal from './CreateFormModal';
import css from './index.less';
const { TreeNode } = Tree;
import { Form2, Input } from '@/design/components';
import FormItem from 'antd/lib/form/FormItem';

class ClientManagementSalesManagement extends PureComponent {
  public $subModalForm: Form2 = null;
  public $branchModalForm: Form2 = null;

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
  };

  public componentDidMount = () => {
    this.fetchTable();
    this.handleTreeNode();
  };

  public handleTreeNode = async () => {
    const { error, data } = await queryCompanys();
    if (error) return;
    const newData = arr2treeOptions(data, ['subsidiary', 'branch'], ['subsidiary', 'branch']);
    const treeData = newData.map(item => {
      return {
        title: item.label,
        key: item.value,
        children: item.children.map(branchName => {
          return {
            title: branchName.label,
            key: item.value + '-' + branchName.value,
          };
        }),
      };
    });
    this.setState({
      treeNodeData: treeData,
    });
  };

  public fetchTable = () => {
    // this.setState({
    //   loading: true,
    // });
    // delay(
    //   1000,
    //   mockData({
    //     salesName: '@name',
    //     branch: '@name',
    //     subsidiary: '@name',
    //     createAt: '@date',
    //   })
    // ).then(res => {
    //   this.setState({
    //     dataSource: res,
    //     loading: false,
    //   });
    // });
  };

  public switchModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  public onCreate = () => {
    this.setState({
      confirmLoading: true,
      visible: false,
    });
  };

  public handleValueChange = params => {
    this.setState({
      createFormData: params.values,
    });
  };

  public onEdit = (params, e) => {
    console.log(this);
    e.stopPropagation();
    if (params.children) {
      return this.setState({
        subModalVisible: true,
      });
    }
    return this.setState(
      {
        branchFormData: {
          subsidiaryName: {
            type: 'field',
            value: params.key.split('-')[0],
          },
        },
      },
      () => {
        console.log(this.state.branchFormData);
        this.setState({
          branchModalVisible: true,
        });
      }
    );
  };

  // 未完成remove
  public onRemove = params => {};

  public onAdd = (params, e) => {
    e.stopPropagation();
    if (params.children) {
      return this.setState({
        subModalVisible: true,
      });
    }
    return this.setState(
      {
        branchFormData: {
          subsidiaryName: {
            type: 'field',
            value: params.key.split('-')[0],
          },
        },
      },
      () => {
        console.log(this.state.branchFormData);
        this.setState({
          branchModalVisible: true,
        });
      }
    );
  };

  public renderTreeNodes = data => {
    // return data.map(item => {
    //   if (item.children) {
    //     return (
    //       <li key={item.key + '-root'} style={{ marginBottom: '10px' }} className={css.listItem}>
    //         <div style={{ marginBottom: '5px' }}>
    //           <Icon type="plus-square" style={{ marginRight: '10px' }} />
    //           <span
    //             className={item.key === this.state.key ? css.background : css.value}
    //             onClick={() => this.changeKey(item)}
    //           >
    //             {item.title}
    //           </span>
    //         </div>
    //         <ul>{this.renderTreeNodes(item.children)}</ul>
    //       </li>
    //     );
    //   }
    //   return (
    //     <li key={item.key + '-node'} style={{ display: 'flex', marginBottom: '5px' }}>
    //       <div style={{ marginRight: '30px' }}>
    //         {/* <Icon type="plus-square" style={{ marginRight: '10px' }} /> */}
    //         <div
    //           className={item.key === this.state.key ? css.background : css.value}
    //           onClick={() => this.changeKey(item)}
    //           contenteditable={String(this.state.editable)}
    //           onBlur={this.cancelEdit.bind(this, item)}
    //         >
    //           {item.title}
    //         </div>
    //       </div>
    //       <div className={css.icon}>
    //         <Icon type="edit" style={{ marginRight: '5px' }} onClick={() => this.onEdit(item)} />
    //         <Icon
    //           type="minus-circle"
    //           style={{ marginRight: '5px' }}
    //           onCLick={() => this.onRemove(item)}
    //         />
    //         <Icon
    //           type="plus-circle"
    //           style={{ marginRight: '5px' }}
    //           onClick={() => this.onAdd(item)}
    //         />
    //       </div>
    //     </li>
    //   );
    // });
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
                    onClick={this.onEdit.bind(this, item)}
                  />
                  <Popconfirm
                    title="确认删除此审批组"
                    onConfirm={this.onRemove(item)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Icon type="minus-circle" style={{ marginRight: '10px' }} />
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
                  onClick={this.onEdit.bind(this, item)}
                />
                <Popconfirm
                  title="确认删除此审批组"
                  onConfirm={this.onRemove(item)}
                  okText="确认"
                  cancelText="取消"
                >
                  <Icon type="minus-circle" style={{ marginRight: '10px' }} />
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
    const arr = selectedKeys[0].split('-');
    if (arr.length === 2) {
      this.setState({
        loading: true,
      });
      const { error, data } = await querySalers({
        subsidiaryName: arr[0],
        branchName: arr[1],
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
    });
  };

  public handleCancelBranch = () => {
    this.setState({
      branchModalVisible: false,
    });
  };

  // 未完成后端编辑接口
  public handleConfirmSub = async () => {
    const { error } = await this.$subModalForm.validate();
    if (error) return;
    this.setState(
      {
        subModalVisible: false,
      },
      () => {}
    );
  };

  // 未完成后端编辑接口
  public handleConfirmBranch = async () => {
    const { error } = await this.$branchModalForm.validate();
    if (error) return;
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

  public render() {
    return (
      <PageHeaderWrapper title="销售管理">
        <Row type="flex" justify="space-between" gutter={32}>
          <Col>
            <Tree showLine={true} onSelect={this.onSelect} blockNode={false}>
              {this.renderTreeNodes(this.state.treeNodeData)}
            </Tree>
            {/* <ul>{this.renderTreeNodes(this.state.treeNodeData)}</ul> */}
          </Col>
          <Col>
            <SourceTable
              rowKey="uuid"
              dataSource={this.state.dataSource}
              columnDefs={TABLE_COL_DEF}
              loading={this.state.loading}
              header={
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
                    />
                  }
                >
                  新建销售
                </ModalButton>
              }
            />
          </Col>
        </Row>
        <Modal
          title={'创建分公司'}
          visible={this.state.subModalVisible}
          onCancel={this.handleCancelSub}
          onOk={this.handleConfirmSub}
        >
          <Form2
            ref={node => (this.$subModalForm = node)}
            layout="inline"
            dataSource={this.state.subFormData}
            onFieldsChange={this.onSubFormChange}
            submitable={false}
            resetable={false}
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
                      })(<Input placeholder="请输入分公司名称" />)}
                    </FormItem>
                  );
                },
              },
            ]}
          />
        </Modal>
        <Modal
          title={'创建营业部'}
          visible={this.state.branchModalVisible}
          onCancel={this.handleCancelBranch}
          onOk={this.handleConfirmBranch}
        >
          <Form2
            ref={node => (this.$branchModalForm = node)}
            layout="inline"
            dataSource={this.state.branchFormData}
            onFieldsChange={this.onBranchFormChange}
            submitable={false}
            resetable={false}
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
                      })(<Input />)}
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
