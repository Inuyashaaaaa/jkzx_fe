/* eslint-disable */
import {
  wkApproveGroupCreate,
  wkApproveGroupDelete,
  wkApproveGroupModify,
} from '@/services/auditing';
import { Button, Icon, Input, Modal, notification, Popconfirm, List } from 'antd';
import React, { PureComponent } from 'react';
import styles from './AuditGourpLists.less';
import _ from 'lodash';
import { Table2, Select, Form2 } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';

class AuditLists extends PureComponent {
  public $form: Form2 = null;

  public state = {
    approveGroupList: [],
    visible: false,
    approveGroupId: '',
    createFormData: {},
  };

  constructor(props) {
    super(props);
  }

  public componentWillReceiveProps = nextProps => {
    const { approveGroupList } = nextProps;
    this.setState({
      approveGroupList,
    });
  };

  public confirm = param => async () => {
    const { error } = await wkApproveGroupDelete({
      approveGroupId: param.approveGroupId,
      approveGroupName: param.approveGroupName,
    });
    const { message } = error;
    if (error) {
      return;
    } else {
      const newList = [];
      const approveGroupList = this.state.approveGroupList.filter(
        item => item.approveGroupId !== param.approveGroupId,
      );

      this.state.approveGroupList.forEach(item => {
        if (item.approveGroupId !== param.approveGroupId) {
          newList.push(item);
        }
      });
      this.setState({
        approveGroupList,
      });
      this.changeGroupList();

      notification.success({
        message: `删除成功`,
        description: message,
      });
    }
  };

  public onEdit = param => () => {
    const approveGroupList = this.state.approveGroupList.map(item => {
      if (item.approveGroupId === param.approveGroupId) {
        item.editable = !param.editable;
      }
      return item;
    });
    this.setState(
      {
        approveGroupList,
      },
      () => {
        this.changeGroupList();
      },
    );
  };

  public onAdd = () => {
    let blockGroupName = false;
    let { approveGroupList } = this.state;
    approveGroupList.forEach(item => {
      if (!item.approveGroupId) {
        blockGroupName = true;
      }
    });
    if (blockGroupName) return;

    const newItem = [
      {
        approveGroupName: '',
        approveGroupId: '',
        editable: true,
        usernameList: [],
      },
    ];
    approveGroupList = approveGroupList.concat(newItem);
    this.setState(
      {
        approveGroupList,
      },
      () => {
        this.changeGroupList();
      },
    );
  };

  public showModal = param => {
    if (param) {
      this.setState({
        approveGroupId: param.approveGroupId,
        createFormData: Form2.createFields({
          approveGroupName: param.approveGroupName,
          description: param.description,
        }),
      });
    }
    this.setState({
      visible: true,
    });
  };

  public handleOk = async e => {
    if (this.state.approveGroupId) {
      const res = await this.$form.validate();
      if (res.error) {
        return;
      }
      const { data, error } = await wkApproveGroupModify({
        approveGroupId: this.state.approveGroupId,
        ...Form2.getFieldsValue(this.state.createFormData),
      });
      const { message } = error;
      if (error) {
        return;
      }

      notification.success({
        message: `编辑成功`,
        description: message,
      });

      const approveGroupList = [...data];
      approveGroupList.sort((a, b) => {
        return a.approveGroupName.localeCompare(b.approveGroupName);
      });
      this.setState(
        {
          approveGroupList,
          visible: false,
          approveGroupId: '',
        },
        () => {
          this.changeGroupList();
        },
      );
      return;
    }
    const res = await this.$form.validate();
    if (res.error) {
      return;
    }
    const { data, error, raw } = await wkApproveGroupCreate({
      ...Form2.getFieldsValue(this.state.createFormData),
    });
    const { message } = error;
    if (error) {
      return;
    } else {
      notification.success({
        message: `创建成功`,
        description: message,
      });
      let approveGroupList = [];
      approveGroupList = _.sortBy(data, ['approveGroupName']);

      this.setState(
        {
          visible: false,
          approveGroupList,
        },
        () => {
          this.changeGroupList();
        },
      );
    }
  };

  public handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  public changeGroupList = () => {
    this.props.handleGroupList(this.state.approveGroupList);
  };

  public handleMenber = param => {
    if (!param) return;
    this.setState({
      indexGroupId: param.approveGroupId,
    });
    this.props.handleMenber(param);
  };

  public onValuesChange = (data, changedValues, allValues) => {
    const { createFormData } = this.state;
    this.setState({
      createFormData: {
        ...createFormData,
        ...changedValues,
      },
    });
  };

  public render() {
    return (
      <div style={{ height: '100%', position: 'relative' }} className={styles.lists}>
        {this.state.approveGroupList && this.state.approveGroupList.length ? (
          <>
            <List
              pagination={{
                pageSize: 10,
                simple: true,
              }}
              dataSource={this.state.approveGroupList}
              renderItem={(item, index) => {
                return (
                  <List.Item
                    key={item.approveGroupId}
                    className={
                      item.approveGroupId === this.state.indexGroupId
                        ? styles.listItem1
                        : styles.listItem2
                    }
                  >
                    <List.Item.Meta
                      title={
                        <>
                          <span className={styles.name} onClick={() => this.handleMenber(item)}>
                            {item.approveGroupName}
                          </span>
                          <span className={styles.icon}>
                            <Icon type="edit" onClick={() => this.showModal(item)} />
                            <Popconfirm
                              title="确认删除此审批组"
                              onConfirm={this.confirm(item)}
                              okText="确认"
                              cancelText="取消"
                            >
                              <Icon type="minus-circle" />
                            </Popconfirm>
                          </span>
                        </>
                      }
                    />
                  </List.Item>
                );
              }}
            />
            <Button
              type="dashed"
              style={{ width: '100%', margin: '20px 0' }}
              onClick={this.showModal}
              size="large"
            >
              新建审批组
            </Button>
          </>
        ) : (
          <Button className={styles.center} type="primary" onClick={this.showModal}>
            新建审批组
          </Button>
        )}
        <Modal
          title="创建/编辑审批组"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form2
            ref={node => {
              this.$form = node;
            }}
            dataSource={this.state.createFormData}
            columns={[
              {
                title: '名称',
                dataIndex: 'approveGroupName',
                render: (val, record, index, { form }) => (
                  <FormItem>
                    {form.getFieldDecorator({
                      rules: [
                        {
                          required: true,
                          message: '名称为必填项',
                        },
                      ],
                    })(<Input />)}
                  </FormItem>
                ),
              },
              {
                title: '描述',
                dataIndex: 'description',
                render: (val, record, index, { form }) => (
                  <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>
                ),
              },
            ]}
            footer={false}
            onFieldsChange={this.onValuesChange}
          />
        </Modal>
      </div>
    );
  }
}

export default AuditLists;
