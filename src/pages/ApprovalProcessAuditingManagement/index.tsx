import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  authPagePermissionGetByRoleId,
  authRolesList,
  createRole,
  queryAllPagePermissions,
  updateRole,
  updateRolePagePermissions,
} from '@/services/role';
import { Button, Col, Drawer, Icon, message, Popconfirm, Row, Table } from 'antd';
import React, { PureComponent } from 'react';
import styles from './auditing.less';
import AuditingList from './auditLists';
import DrawerContarner from './DrawerContarner';

const columns = [
  {
    title: '用户名',
    dataIndex: 'name',
    key: 'name',
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
    render: () => <a style={{ color: 'red' }}>移出</a>,
  },
];
class SystemSettingsRoleManagement extends PureComponent {
  public $sourceTable: SourceTable = null;

  public $form: Form = null;

  public state = {
    dataSource: [],
    loading: false,
    visible: false,
    formData: {},
    displayResources: false,
    choosedRole: {},
    auditingList: [],
    hover: false,
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.fetchTable();
    this.fetchList();
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

    // const auditingList = [
    //   {
    //     name: '风控审批组',
    //     id: 1,
    //   },
    //   {
    //     name: '客户审批组',
    //     id: 2,
    //   },
    //   {
    //     name: '交易审批组',
    //     id: 3,
    //   }
    // ];
    const auditingList = [];

    this.setState({
      auditingList,
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
      dataSource: [{ roleName: 1 }],
    });
    return;
  };

  public handleDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  // public handleDrawer = async () => {
  //   const { error, data } = await authPagePermissionGetByRoleId({
  //     roleId: this.props.data.id,
  //   });
  //   if (error) {
  //     message.error('页面权限获取失败');
  //     return;
  //   }
  //   const checkedKey = data.map(item => {
  //     return _.toPairs(this.props.data.newPageMap).filter(items => items[1] === item)[0][0];
  //   });
  //   const checkedKeys = checkedKey.filter(item => {
  //     return !fatherTreeNode.find(items => item === items);
  //   });
  //   this.setState({
  //     visible: true,
  //     checkedKeys,
  //   });
  // };

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

  public render() {
    return (
      <>
        <div className={styles.auditingWrapper}>
          <PageHeaderWrapper>
            <div style={{ width: '300px', background: '#FFF', padding: '30px' }}>
              <p>审批组列表</p>
              <AuditingList />
            </div>
            <div style={{ marginLeft: '20px', background: '#FFF', padding: '30px' }}>
              <Row style={{ marginBottom: '10px', textAlign: 'right', maxHeight: '28px' }}>
                <span style={{ float: 'left' }}>审批组成员</span>
                <Button size="default" type="primary" onClick={this.handleDrawer}>
                  增加成员
                </Button>
              </Row>
              <Table
                className={styles.menberTable}
                columns={columns}
                dataSource={this.state.dataSource}
              />
            </div>
            {/* {!this.state.displayResources && (
              <SourceTable
                style={{marginLeft: '320px'}}
                ref={node => (this.$sourceTable = node)}
                rowKey={'id'}
                dataSource={this.state.dataSource}
                loading={this.state.loading}
                columnDefs={TABLE_COL_DEF(this.fetchTable, this.showResource)}
                onCellValueChanged={this.onCellValueChanged}
                header={
                  <Row style={{ marginBottom: '10px', textAlign: 'right', maxHeight: '28px'}}>
                    <span style={{float: 'left'}}>审批组成员</span>
                    <Button
                      size="default"
                      type="primary"
                      onClick={this.handleDrawer}
                    >
                      增加成员
                    </Button>
                  </Row>
                }
              />
            )} */}
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
              <DrawerContarner />
            </Drawer>
          </PageHeaderWrapper>
        </div>
      </>
    );
  }
}

export default SystemSettingsRoleManagement;
