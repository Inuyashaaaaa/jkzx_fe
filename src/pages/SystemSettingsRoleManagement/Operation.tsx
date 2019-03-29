import PopconfirmButton from '@/components/PopconfirmButton';
import {
  authPagePermissionGetByRoleId,
  deleteRole,
  updateRolePagePermissions,
} from '@/services/role';
import { Button, Col, Drawer, message, Row, Tree } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { treeData } from './constants';

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
];

class Operation extends PureComponent {
  public state = {
    visible: false,
    selectedKeys: [],
    checkedKeys: [],
    displayResources: false,
  };

  constructor(props) {
    super(props);
  }

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
    const checkedKey = data.map(item => {
      return _.toPairs(this.props.data.newPageMap).filter(items => items[1] === item)[0][0];
    });
    const checkedKeys = checkedKey.filter(item => {
      return !fatherTreeNode.find(items => item === items);
    });
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
    return;
  };

  public render() {
    return (
      <>
        <Row type="flex" align="middle" justify="start">
          <Col>
            <Button type="primary" size="small" onClick={this.handleDrawer}>
              配置页面权限
            </Button>
          </Col>
          <Col>
            <Button type="primary" size="small" onClick={this.handleList}>
              数据权限
            </Button>
          </Col>
          <Col>
            <PopconfirmButton
              type="primary"
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
            checkable={true}
            onCheck={this.onCheck}
            // defaultExpandAll={true}
            defaultCheckedKeys={this.state.checkedKeys}
            checkedKeys={this.state.checkedKeys}
            // checkStrictly={true}
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
      </>
    );
  }
}

export default Operation;
