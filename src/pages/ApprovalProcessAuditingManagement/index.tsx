import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { wkApproveGroupList, wkApproveGroupModify } from '@/services/auditing';
import { deleteRole, updateRolePagePermissions } from '@/services/role';
import { authUserList } from '@/services/user';
import { Button, Col, Drawer, Icon, message, notification, Popconfirm, Row, Table } from 'antd';
import React, { PureComponent } from 'react';
import styles from './auditing.less';
import AuditingList from './auditLists';
import DrawerContarner from './DrawerContarner';

class SystemSettingsRoleManagement extends PureComponent {
  public $sourceTable: SourceTable = null;

  public state = {
    columns: [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '昵称',
        dataIndex: 'alias',
        key: 'alias',
      },
      {
        title: '部门',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.userList.length >= 1 ? (
            <Popconfirm
              title="确认移出?"
              onConfirm={() => this.handleDelete(record.userApproveGroupId)}
            >
              <a style={{ color: 'red' }}>移出</a>
            </Popconfirm>
          ) : null,
      },
    ],
    userList: null,
    loading: false,
    visible: false,
    formData: {},
    displayResources: false,
    choosedRole: {},
    approveGroupList: [],
    hover: false,
    currentGroup: null,
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.fetchTable();
    this.fetchList();
  };

  public handleDelete = async key => {
    // 审批组成员移出
    const { currentGroup } = this.state;
    let userList = [...this.state.userList];
    userList = userList.filter(item => item.userApproveGroupId !== key);
    currentGroup.userList = userList;
    const { data, error } = await wkApproveGroupModify(currentGroup);
    const { message } = error;
    if (error) {
      return notification.error({
        message: `移出失败`,
        description: message,
      });
    } else {
      notification.success({
        message: `移出成功`,
        description: message,
      });
      this.setState({
        visible: false,
      });
    }
    this.setState({ userList });
  };

  public handlePages(data, result1, result2) {
    const { pageName, id, children } = data;
    result1[pageName] = id;
    if (children) {
      children.forEach(child => this.handlePages(child, result1, result2));
    } else {
      result2[pageName] = id;
    }
  }

  public fetchList = async () => {
    this.setState({
      loading: true,
    });

    const { data, error, raw } = await wkApproveGroupList();
    if (error) return;
    this.setState({
      approveGroupList: data,
      userList: data.userList,
      loading: false,
    });
  };

  public fetchTable = async () => {
    // this.setState({
    //   loading: true,
    // });
    // const requests = () => Promise.all([authRolesList(), queryAllPagePermissions({})]);
    // const [roles, allPagesPermissions] = await requests();
    // const roles = [];
    // if (roles.error || allPagesPermissions.error) {
    //   this.setState({
    //     loading: false,
    //   });
    //   return false;
    // }
    //
    // const pageMap = {};
    // const entityPageMap = {};
    // // this.handlePages(allPagesPermissions.data, pageMap, entityPageMap);
    // const newPageMap = pageMap;
    // const newEntityPageMap = entityPageMap;

    // const dataSource = roles.data.map(item => {
    //   return {
    //     ...item,
    //     newPageMap,
    //   };
    // });
    // this.setState({
    //   loading: false,
    //   dataSource: dataSource.sort((role1, role2) => role1.roleName.localeCompare(role2.roleName)),
    // });
    this.setState({
      // loading: false,
      userList: [],
    });
    return;
  };

  public handleDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  public onClose = () => {
    this.setState({
      visible: false,
    });
  };

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
    this.fetchTable();
  };

  public handleFormChange = params => {
    this.setState({
      formData: params.values,
    });
  };

  public hideResource = () => {
    this.setState({
      displayResources: false,
    });
  };

  public showResource = data => {
    this.setState({
      displayResources: true,
      choosedRole: data,
    });
  };

  public onCellValueChanged = async event => {
    const { error, data } = await updateRole({
      ...event.data,
      roleId: event.data.id,
    });
    if (error) return;
  };

  public onEdit = async param => {
    console.log(param);
    this.setState({
      userList: param.userList,
    });
  };

  public handleMenber = async param => {
    // 切换审批组成员
    if (!param) return;
    this.setState({
      userList: param.userList,
      currentGroup: param,
    });
  };

  public onBatchAdd = async param => {
    // 批量加入
    const { currentGroup } = this.state;
    currentGroup.userList = currentGroup.userList.concat(param);
    const { data, error } = await wkApproveGroupModify(currentGroup);
    const { message } = error;
    if (error) {
      return notification.error({
        message: `加入失败`,
        description: message,
      });
    } else {
      notification.success({
        message: `加入成功`,
        description: message,
      });
      this.setState({
        visible: false,
      });
    }

    currentGroup.userList = data.userList;

    const approveGroupList = this.state.approveGroupList.map(item => {
      if (item.approveGroupId === currentGroup.approveGroupId) {
        item = data;
      }
      return item;
    });
    this.setState({
      approveGroupList,
      visible: false,
      currentGroup,
      userList: data.userList,
    });
  };

  public render() {
    return (
      <>
        <div className={styles.auditingWrapper}>
          <PageHeaderWrapper>
            <div style={{ width: '400px', background: '#FFF', padding: '30px' }}>
              <p>审批组列表</p>
              <AuditingList
                approveGroupList={this.state.approveGroupList}
                handleEdit={param => this.onEdit(param)}
                handleMenber={this.handleMenber}
              />
            </div>
            <div
              style={{
                marginLeft: '20px',
                background: '#FFF',
                padding: '30px',
                width: '100%',
                position: 'relative',
              }}
            >
              <Row style={{ marginBottom: '10px', textAlign: 'right', maxHeight: '28px' }}>
                <span style={{ float: 'left' }}>审批组成员</span>
                {this.state.userList && this.state.userList.length ? (
                  <Button size="default" type="primary" onClick={this.handleDrawer}>
                    增加成员
                  </Button>
                ) : null}
              </Row>
              {this.state.userList && this.state.userList.length ? (
                <Table
                  className={styles.menberTable}
                  columns={this.state.columns}
                  dataSource={this.state.userList}
                />
              ) : (
                <span className={styles.center}>请先选中一个审批组</span>
              )}
            </div>
            <Drawer
              placement="right"
              onClose={this.onClose}
              visible={this.state.visible}
              width={500}
              title={
                <Row type="flex" justify="start" gutter={24}>
                  <p>增加成员</p>
                </Row>
              }
            >
              <DrawerContarner
                onBatchAdd={param => this.onBatchAdd(param)}
                currentGroup={this.state.currentGroup}
              />
            </Drawer>
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default SystemSettingsRoleManagement;
