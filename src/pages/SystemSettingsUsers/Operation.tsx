import React, { PureComponent } from 'react';
import { Popconfirm, Button, Divider, Dropdown, Menu, Icon, Modal } from 'antd';
import { Form2 } from '@/components';
const MenuItem = Menu.Item;

class Operation extends PureComponent<{ record: any; showResources: any }> {
  public $form: Form2 = null;

  public state = {
    userModalVisible: false,
    userDataSource: [],
  };
  public onRemove = () => {};
  public resetPassword = () => {};
  public lockUser = () => {};
  public expireUser = () => {};
  public updateUser = record => {};

  public onMenuClick = ({ item, key, keyPath }) => {
    if (key === 'reset') {
      this.resetPassword();
    }
    if (key === 'modify') {
      this.showModal();
    }
    if (key === 'resource') {
      this.props.showResources(this.props.record);
    }
  };

  public showModal = () => {
    this.setState({
      userModalVisible: !this.state.userModalVisible,
    });
  };

  public handleModify = () => {};

  public handleFieldsChange = () => {};

  public render() {
    const { userModalVisible, userDataSource } = this.state;
    return (
      <>
        <Popconfirm title={'确定要删除吗？'} onConfirm={this.onRemove}>
          <Button type="link" key="remove" size="small">
            删除
          </Button>
        </Popconfirm>
        <Divider type="vertical" />
        <Button key="lock" type="link" onClick={() => this.lockUser} size="small">
          {/* {!locked ? '锁定用户' : '解锁用户'} */}
          {'解锁用户'}
        </Button>
        <Divider type="vertical" />
        <Button key="expire" type="link" onClick={() => this.expireUser} size="small">
          {/* {expired ? '使用户在期' : '过期用户'} */}
          {'过期用户'}
        </Button>
        <Divider type="vertical" />
        <Dropdown
          overlay={
            <Menu onClick={this.onMenuClick}>
              <MenuItem key="reset">重置密码</MenuItem>
              <MenuItem key="modify">修改用户</MenuItem>
              <MenuItem key="resource">数据权限</MenuItem>
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
        >
          <Form2
            ref={node => (this.$form = node)}
            dataSource={userDataSource}
            onFieldsChange={this.handleFieldsChange}
            footer={false}
          />
        </Modal>
      </>
    );
  }
}

export default Operation;
