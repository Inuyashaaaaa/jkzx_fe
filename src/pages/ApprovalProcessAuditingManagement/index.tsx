import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { wkApproveGroupList, wkApproveGroupModify } from '@/services/auditing';
import { Button, Drawer, notification, Popconfirm, Row, Table } from 'antd';
import React, { PureComponent } from 'react';
import AuditGourpLists from './AuditGourpLists';
import styles from './Auditing.less';
import DrawerContarner from './DrawerContarner';

class SystemSettingsRoleManagement extends PureComponent {
  // public $drawer: DrawerContarner = null;

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
    console.log('fetch');
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

  public handleDrawer = () => {
    // this.$drawer && this.$drawer.fetchTable();
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

  public handleGroupList = approveGroupList => {
    if (approveGroupList) {
      this.setState({
        approveGroupList,
      });
    }
  };

  public render() {
    return (
      <>
        <div className={styles.auditingWrapper}>
          <PageHeaderWrapper>
            <div style={{ width: '400px', background: '#FFF', padding: '30px' }}>
              <p>审批组列表</p>
              <AuditGourpLists
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
                  dataSource={this.state.userList}
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
              width={500}
              title={
                <Row type="flex" justify="start" gutter={24}>
                  <p>增加成员</p>
                </Row>
              }
            >
              <DrawerContarner
                ref={node => (this.$drawer = node)}
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
