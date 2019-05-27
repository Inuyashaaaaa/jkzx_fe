import React, { PureComponent } from 'react';
import { Popconfirm, Button, Divider, Dropdown, Menu, Icon, Modal, message } from 'antd';
import { Form2 } from '@/containers';
import { UPDATE_FORM_CONTROLS, RESET_FORM } from './constants';
import {
  updateUser,
  saveUserPasswordByAdmin,
  deleteUser,
  unlockUser,
  lockUser,
  unexpireUser,
  expireUser,
} from '@/services/user';
const MenuItem = Menu.Item;

class Operation extends PureComponent<{
  record: any;
  showResources: any;
  departments: any;
  fetchData: any;
}> {
  public $form: Form2 = null;

  public $resetForm: Form2 = null;

  public state = {
    userModalVisible: false,
    userDataSource: {},
    confirmLoading: false,
    resetModalVisible: false,
    resetDataSource: {},
    resetConfirmLoading: false,
  };

  public componentDidMount = () => {
    this.setState({
      userDataSource: Form2.createFields(this.props.record),
    });
  };

  public onRemove = async () => {
    const { id } = this.props.record;
    const res = await deleteUser({ userId: id });
    if (res.error) {
      message.error('删除失败');
      return;
    }
    message.success('删除成功');
    this.props.fetchData();
  };

  public lockUser = async () => {
    const executeMethod = this.props.record.locked ? unlockUser : lockUser;
    const { error } = await executeMethod({
      username: this.props.record.username,
    });
    if (error) return;
    const tips = this.props.record.locked ? '解锁成功' : '锁定成功';
    message.success(tips);
    this.props.fetchData();
  };
  public expireUser = async () => {
    const executeMethod = this.props.record.expired ? unexpireUser : expireUser;
    const { error } = await executeMethod({
      username: this.props.record.username,
    });

    if (error) return;

    const tips = this.props.record.expired ? '使密码有效成功' : '密码过期成功';
    message.success(tips);
    this.props.fetchData();
  };

  public onMenuClick = ({ item, key, keyPath }) => {
    if (key === 'reset') {
      this.showResetModal();
    }
    if (key === 'modify') {
      this.showModal();
    }
    if (key === 'expired') {
      this.expireUser();
    }
    if (key === 'locked') {
      this.lockUser();
    }
  };

  public showModal = () => {
    this.setState({
      userModalVisible: !this.state.userModalVisible,
    });
  };

  public handleModify = async () => {
    const validateRsp = await this.$form.validate();

    if (validateRsp.error) return;
    this.setState({
      confirmLoading: true,
    });
    const { error, data } = await updateUser({
      ...Form2.getFieldsValue(this.state.userDataSource),
      userId: this.props.record.id,
    });
    this.setState({
      confirmLoading: false,
    });
    if (error) {
      message.error('修改失败');
      return;
    }
    message.success('修改成功');
    this.setState({
      userModalVisible: false,
    });
    this.props.fetchData();
  };

  public handleFieldsChange = (props, fields, allFields) => {
    this.setState({
      userDataSource: allFields,
    });
  };

  public showResetModal = () => {
    this.setState({
      resetModalVisible: !this.state.resetModalVisible,
    });
  };

  public handleReset = async () => {
    const validateRsp = await this.$resetForm.validate();
    if (validateRsp.error) return;
    this.setState({
      resetConfirmLoading: true,
    });
    const { error, data } = await saveUserPasswordByAdmin({
      userId: this.props.record.id,
      password: Form2.getFieldsValue(this.state.resetDataSource).password,
    });
    this.setState({
      resetConfirmLoading: false,
    });
    if (error) {
      message.error('修改失败');
      return;
    }
    message.success('修改成功');
    this.setState({ resetModalVisible: false, resetDataSource: {} });
  };

  public handleFieldsChangeReset = (props, fields, allFields) => {
    this.setState({
      resetDataSource: {
        ...this.state.resetDataSource,
        ...fields,
      },
    });
  };

  public render() {
    const { userModalVisible, userDataSource, resetDataSource, resetModalVisible } = this.state;
    return (
      <>
        <a href="javascript:;" onClick={() => this.props.showResources(this.props.record)}>
          数据权限
        </a>
        <Divider type="vertical" />
        <Popconfirm title={'确定要删除吗？'} onConfirm={this.onRemove}>
          <a href="javascript:;" style={{ color: 'red' }}>
            删除
          </a>
        </Popconfirm>

        <Divider type="vertical" />
        <Dropdown
          overlay={
            <Menu onClick={this.onMenuClick}>
              <MenuItem key="reset">重置密码</MenuItem>
              <MenuItem key="modify">修改用户</MenuItem>
              <MenuItem key="expired">
                {this.props.record.expired ? '使用户在期' : '过期用户'}
              </MenuItem>
              <MenuItem key="locked">{this.props.record.locked ? '解锁用户' : '锁定用户'}</MenuItem>
            </Menu>
          }
        >
          <a href="javascript:;">
            更多操作
            <Icon type="down" />
          </a>
        </Dropdown>
        <Modal
          title={'修改用户'}
          visible={userModalVisible}
          onCancel={this.showModal}
          onOk={this.handleModify}
          width={600}
          confirmLoading={this.state.confirmLoading}
        >
          <Form2
            ref={node => (this.$form = node)}
            dataSource={userDataSource}
            onFieldsChange={this.handleFieldsChange}
            footer={false}
            columns={UPDATE_FORM_CONTROLS(this.props.departments)}
          />
        </Modal>
        <Modal
          title={'更改密码'}
          visible={resetModalVisible}
          onCancel={this.showResetModal}
          onOk={this.handleReset}
          width={600}
          confirmLoading={this.state.resetConfirmLoading}
        >
          <Form2
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            ref={node => (this.$resetForm = node)}
            dataSource={resetDataSource}
            onFieldsChange={this.handleFieldsChangeReset}
            footer={false}
            columns={RESET_FORM}
          />
        </Modal>
      </>
    );
  }
}

export default Operation;
