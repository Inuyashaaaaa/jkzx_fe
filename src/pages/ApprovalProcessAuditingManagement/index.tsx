import Page from '@/containers/Page';
import {
  wkApproveGroupList,
  wkApproveGroupModify,
  wkApproveGroupUserListModify,
} from '@/services/auditing';
import { queryAuthDepartmentList } from '@/services/department';
import { Button, Drawer, notification, Popconfirm, Row, Table } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import AuditGourpLists from './AuditGourpLists';
import styles from './AuditGourpLists.less';
import DrawerContarner from './DrawerContarner';
class SystemSettingsRoleManagement extends PureComponent {
  public $drawer: DrawerContarner = null;

  public state = {
    columns: [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName',
      },
      {
        title: '部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
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
    department: [],
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.fetchList();
  };

  public handleDelete = async key => {
    const { currentGroup } = this.state;
    let userList = [...this.state.userList];
    userList = userList.filter(item => item.userApproveGroupId !== key);

    currentGroup.userList = userList;
    const { data, error } = await wkApproveGroupUserListModify({
      approveGroupId: currentGroup.approveGroupId,
      approveGroupName: currentGroup.approveGroupName,
      userList: userList.map(item => item.username),
    });
    const { message } = error;
    if (error) {
      return;
    } else {
      notification.success({
        message: `移出成功`,
        description: message,
      });
      if (this.$drawer) {
        this.$drawer.fetchTable();
      }

      this.setState({
        visible: false,
      });
    }
    this.setState({ userList });
  };

  public fetchList = async () => {
    this.setState({
      loading: true,
    });

    const { data, error } = await wkApproveGroupList();
    if (error) return;

    let approveGroupList = [];
    approveGroupList = _.sortBy(data, ['approveGroupName']);

    const department = await queryAuthDepartmentList();
    if (department.error) {
      return;
    }

    const cloneDepartments = JSON.parse(JSON.stringify(department.data || {}));
    const array = this.toArray(cloneDepartments);

    if (this.$gourpLists) {
      this.$gourpLists.handleMenber(data[0]);
    }

    this.setState({
      approveGroupList,
      loading: false,
      department: array,
    });
  };

  public toArray = data => {
    let array = [];
    const children = data.children || [];
    delete data.children;
    array.push(data);

    array = array.concat(children);
    if (!children) return;
    children.forEach(item => {
      this.toArray(item);
    });
    return array;
  };

  public handleDrawer = () => {
    if (this.$drawer) {
      this.$drawer.fetchTable();
    }
    this.setState({
      visible: true,
    });
  };

  public onClose = () => {
    this.setState({
      visible: false,
    });
  };

  public onEdit = async param => {
    this.setState({
      userList: param.userList,
    });
  };

  public handleMenber = async param => {
    if (!param) return;
    this.setState({
      userList: param.userList,
      currentGroup: param,
    });
  };

  public onBatchAdd = async (param, batchBool) => {
    const { currentGroup } = this.state;
    const _d = _.intersection(
      param.map(p => p.username),
      (this.state.currentGroup.userList || []).map(p => p.username)
    );
    if (_d.length > 0) {
      return notification.success({
        message: '该用户已在审批组中',
      });
    }
    currentGroup.userList = (currentGroup.userList || []).concat(param);
    const userList = currentGroup.userList.map(item => {
      return {
        userApproveGroupId: item.userApproveGroupId,
        username: item.username,
        departmentId: item.departmentId,
        nickName: item.nickName,
      };
    });
    const { data, error } = await wkApproveGroupUserListModify({
      approveGroupId: currentGroup.approveGroupId,
      approveGroupName: currentGroup.approveGroupName,
      userList: userList.map(item => item.username),
    });
    if (error) {
      return;
    } else {
      notification.success({
        message: batchBool
          ? `${param.length}个用户成功加入审批组,${currentGroup.userList.length}个用户已在审批组中`
          : '成功加入审批组',
      });
    }
    currentGroup.userList =
      data[
        _.findIndex(data, item => {
          return item.approveGroupId === currentGroup.approveGroupId;
        })
      ].userList;
    const approveGroupList = _.sortBy(data, ['approveGroupName']);
    this.setState(
      {
        approveGroupList,
        currentGroup,
        userList: currentGroup.userList,
      },
      () => {
        if (this.$drawer) {
          this.$drawer.filterData((data.userList || []).map(item => item.username));
        }
      }
    );
  };

  public handleGroupList = approveGroupList => {
    if (approveGroupList) {
      this.setState({
        approveGroupList,
      });
    }
  };

  public render() {
    let { userList } = this.state;
    const { department } = this.state;
    userList = (userList || []).sort((a, b) => {
      return a.username.localeCompare(b.username);
    });
    userList.map(param => {
      const dp = department.find(obj => obj.id === param.departmentId) || {};
      param.departmentName = dp.departmentName;
      return param;
    });
    return (
      <>
        <div className={styles.auditingWrapper}>
          <Page>
            <div style={{ width: '400px', background: '#FFF', padding: '30px' }}>
              <p>审批组列表</p>
              <AuditGourpLists
                ref={node => (this.$gourpLists = node)}
                approveGroupList={this.state.approveGroupList}
                handleEdit={param => this.onEdit(param)}
                handleMenber={this.handleMenber}
                handleGroupList={this.handleGroupList}
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
                {this.state.userList ? (
                  <Button size="default" type="primary" onClick={this.handleDrawer}>
                    增加成员
                  </Button>
                ) : null}
              </Row>
              {this.state.userList ? (
                <Table
                  className={styles.menberTable}
                  columns={this.state.columns}
                  dataSource={userList}
                  rowKey={data => data.userApproveGroupId}
                />
              ) : (
                <span className={styles.center}>请先选中一个审批组</span>
              )}
            </div>
            <Drawer
              placement="right"
              onClose={this.onClose}
              visible={this.state.visible}
              width={600}
              title={
                <Row type="flex" justify="start" gutter={24}>
                  <p>增加成员</p>
                </Row>
              }
            >
              <DrawerContarner
                ref={node => (this.$drawer = node)}
                onBatchAdd={(param, bool) => this.onBatchAdd(param, bool)}
                currentGroup={this.state.currentGroup}
              />
            </Drawer>
          </Page>
        </div>
      </>
    );
  }
}

export default SystemSettingsRoleManagement;
