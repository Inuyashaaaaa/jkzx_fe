import { Button, Col, Drawer, message, Row, Tree, Divider, Modal } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import {
  authPagePermissionGetByRoleId,
  deleteRole,
  updateRolePagePermissions,
  updateRole,
} from '@/services/role';
import PopconfirmButton from '@/containers/PopconfirmButton';
import { treeData, FORM_CONTROL } from './constants';
import { Form2 } from '@/containers';

const { TreeNode } = Tree;

const fatherTreeNode = [
  'default',
  'tradeManagement',
  'pricingSettings',
  'clientManagement',
  'reports',
  'riskManager',
  'approvalProcess',
  'systemSettings',
  'center',
  'market',
];

class Operation extends PureComponent<{ data: any; fetchTable: any; showResource: any }> {
  public $form: Form2 = null;

  public state = {
    visible: false,
    checkedKeys: [],
    formVisible: false,
    formData: {},
    confirmLoading: false,
  };

  public componentDidMount = () => {
    this.setState({
      formData: Form2.createFields(this.props.data),
    });
  };

  public onClose = () => {
    this.setState({
      visible: false,
    });
  };

  public handleDrawer = async () => {
    const { error, data } = await authPagePermissionGetByRoleId({
      roleId: this.props.data.id,
    });
    if (error) {
      message.error('页面权限获取失败');
      return;
    }
    console.log(this.props.data.newPageMap);
    const checkedKey = data.map(
      item => _.toPairs(this.props.data.newPageMap).filter(items => items[1] === item)[0][0],
    );
    console.log(fatherTreeNode);
    const checkedKeys = checkedKey.filter(item => !fatherTreeNode.find(items => item === items));
    console.log(checkedKeys);
    this.setState({
      visible: true,
      checkedKeys,
    });
  };

  public onCheck = checkedKeys => {
    this.setState({
      checkedKeys,
    });
  };

  public renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      if (!item.key) {
        return null;
      }
      return <TreeNode key={item.key} title={item.title} dataRef={item} />;
    });

  public handleSave = async () => {
    const { newPageMap } = this.props.data;
    const checkKeys = this.state.checkedKeys;
    const permissions = _.values(_.pick(newPageMap, checkKeys));
    const params = {
      permissions: [
        {
          roleId: this.props.data.id,
          pageComponentId: permissions,
        },
      ],
    };
    const res = await updateRolePagePermissions(params);
    if (res.error) {
      message.error('权限配置失败');
      return;
    }
    message.success('权限配置成功');
    this.setState({
      visible: false,
    });
    this.props.fetchTable();
  };

  public handleList = () => {
    this.props.showResource(this.props.data);
  };

  public onRemove = async () => {
    const { error, data } = await deleteRole({ roleId: this.props.data.id });
    if (error) {
      message.error('删除失败');
      return;
    }
    message.success('删除成功');
    this.props.fetchTable();
  };

  public showModal = () => {
    const { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible,
    });
  };

  public onConfirm = async () => {
    const validateRsp = await this.$form.validate();
    if (validateRsp.error) return;
    this.setState({
      confirmLoading: true,
    });
    const { error, data } = await updateRole({
      ...Form2.getFieldsValue(this.state.formData),
      roleId: this.props.data.id,
    });
    this.setState({ confirmLoading: false });
    if (error) {
      message.error('修改失败');
      return;
    }
    message.success('修改成功');
    this.setState({
      formVisible: false,
    });
    this.props.fetchTable();
  };

  public handleFormChange = (props, fields, allFields) => {
    this.setState({
      formData: allFields,
    });
  };

  public render() {
    return (
      <>
        <a onClick={this.handleDrawer}>页面权限</a>
        <Divider type="vertical" />
        <a onClick={this.handleList}>数据权限</a>
        <Divider type="vertical" />
        <a onClick={this.showModal}>修改角色</a>
        <Divider type="vertical" />
        <PopconfirmButton
          type="link"
          size="small"
          popconfirmProps={{
            title: '确定要删除吗?',
            onConfirm: this.onRemove,
          }}
        >
          删除
        </PopconfirmButton>
        <Drawer
          placement="right"
          onClose={this.onClose}
          visible={this.state.visible}
          width={500}
          title={
            <Row type="flex" justify="start" gutter={24}>
              <Col>
                <p>配置页面权限</p>
              </Col>
              <Col>
                <p>{`角色:${this.props.data.roleName}`}</p>
              </Col>
            </Row>
          }
        >
          <Tree
            checkable
            onCheck={this.onCheck}
            defaultCheckedKeys={this.state.checkedKeys}
            checkedKeys={this.state.checkedKeys}
            defaultExpandedKeys={this.state.checkedKeys}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
          <Row
            type="flex"
            justify="end"
            gutter={16}
            style={{
              marginTop: '12px',
            }}
          >
            <Col>
              <Button onClick={this.onClose}>取消</Button>
            </Col>
            <Col>
              <Button type="primary" onClick={this.handleSave}>
                保存
              </Button>
            </Col>
          </Row>
        </Drawer>
        <Modal
          visible={this.state.formVisible}
          title="修改角色信息"
          onOk={this.onConfirm}
          onCancel={this.showModal}
          confirmLoading={this.state.confirmLoading}
        >
          <Form2
            ref={node => {
              this.$form = node;
            }}
            dataSource={this.state.formData}
            columns={FORM_CONTROL}
            footer={false}
            onFieldsChange={this.handleFormChange}
          />
        </Modal>
      </>
    );
  }
}

export default Operation;
