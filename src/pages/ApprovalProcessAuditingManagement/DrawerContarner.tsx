import SourceTable from '@/design/components/SourceTable';
import { queryAuthDepartmentList } from '@/services/department';
import { authRolesList } from '@/services/role';
import { authUserList } from '@/services/user';
import {
  Button,
  Form,
  Input,
  notification,
  Row,
  Select,
  Table,
  TreeSelect,
  Popconfirm,
} from 'antd';
import Item from 'antd/lib/list/Item';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import styles from './AuditGourpLists.less';

const TreeNode = TreeSelect.TreeNode;
const { Option } = Select;

class Operation extends PureComponent {
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
        render: (text, record) => (
          <a
            onClick={() => this.onAdd(record.id)}
            style={{ display: 'inline-block', minWidth: '40px', fontSize: '12px' }}
          >
            加入审批组
          </a>
        ),
      },
    ],
    departmentTree: [],
    visible: false,
    username: null,
    roleName: null,
    rolesList: [],
    dataSource: [],
    loading: false,
    selectedRowKeys: [],
    selectArray: [],
    departmentId: null,
    array: [],
    data: [],
    filterItem: 'username',
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.fetchTable();
  };

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const requests = () =>
      Promise.all([authRolesList(), authUserList(), queryAuthDepartmentList({})]);
    const res = await requests();
    const [roles, users, departmentsRes] = res;
    const departments = departmentsRes.data || {};
    const departmentTree = [];
    departmentTree.push(departments);

    const error = res.some(item => {
      return item.error;
    });

    if (error) {
      this.setState({
        loading: false,
      });
      return false;
    }
    const { currentGroup } = this.props;

    const cloneDepartments = JSON.parse(JSON.stringify(departments));

    const array = this.toArray(cloneDepartments);
    let dataSource = users.data.map(item => {
      const department = array.find(obj => obj.id === item.departmentId);
      item.departmentName = department.departmentName;
      return item;
    });
    dataSource = dataSource.filter(item => {
      return !currentGroup.userList.find(items => item.username === items.username);
    });

    dataSource.sort((a, b) => {
      return a.username.localeCompare(b.username);
    });

    const data = dataSource;
    this.setState({
      loading: false,
      dataSource,
      selectedRowKeys: [],
      selectArray: [],
      rolesList: roles.data,
      departmentTree,
      data,
    });
  };

  public filterData = keys => {
    if (keys) {
      let { selectArray } = this.state;
      selectArray = selectArray.filter(item => {
        return !keys.includes(item.username);
      });
      this.setState({
        selectArray,
      });
    }

    const { currentGroup } = this.props;
    let { dataSource } = this.state;
    dataSource = dataSource.filter(item => {
      return !currentGroup.userList.find(items => item.username === items.username);
    });
    this.setState({
      dataSource,
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

  public toTree = (data = []) => {
    if (!data) return null;
    data.forEach(item => {
      item.title = item.departmentName;
      item.value = item.id;
      item.key = item.id;
      if (!!item.children) {
        item.children.forEach(item => {
          this.toTree(item.children);
        });
      }
    });

    return data;
  };

  public onClose = () => {
    this.setState({
      visible: false,
    });
  };

  public onUserName = e => {
    this.setState({
      username: e.target.value,
    });
  };

  public onRole = e => {
    this.setState({
      roleName: e,
    });
  };

  public onDepartment = e => {
    this.setState({
      departmentId: e,
    });
  };

  public onSearch = async () => {
    const { data, filterItem } = this.state;
    let dataSource = data;
    dataSource = data.filter(item => {
      return this.state[filterItem] ? item[filterItem].indexOf(this.state[filterItem]) >= 0 : true;
    });
    this.setState({
      dataSource,
    });
  };

  public onBatchAdd = () => {
    if (this.state.selectArray.length <= 0) {
      return notification.error({
        message: `请选择一个成员`,
      });
    }
    this.props.onBatchAdd(this.state.selectArray);
    this.setState({
      selectArray: [],
      selectedRowKeys: [],
    });
  };

  public onAdd = key => {
    const selectObj = this.state.dataSource.filter(item => item.id === key);
    let selectArray = [...selectObj];
    selectArray = selectArray.map(item => {
      return {
        userApproveGroupId: item.id,
        username: item.username,
        department_id: item.departmentId,
        nick_name: item.nickName,
      };
    });
    this.props.onBatchAdd(selectArray);
  };

  public onSelectChange = (selectedRowKeys, selectedRow) => {
    let selectArray = [];
    selectArray = selectedRow.map(item => {
      return {
        userApproveGroupId: item.id,
        username: item.username,
        department_id: item.departmentId,
        nick_name: item.nickName,
      };
    });
    this.setState({ selectArray, selectedRowKeys });
  };

  public renderTreeNode = (treeData = []) => {
    if (!treeData) return;
    const treeNode = [];
    treeData.map((ele, index) => {
      treeNode.push(
        <TreeNode value={ele.id} title={ele.departmentName} key={ele.id}>
          {this.renderTreeNode(ele.children)}
        </TreeNode>
      );
    });
    return treeNode;
  };

  public handleChange = e => {
    this.setState({
      filterItem: e,
    });
  };

  public onReset = e => {
    this.setState(
      {
        filterItem: 'username',
        username: null,
        roleName: null,
        departmentId: null,
      },
      () => {
        this.onSearch();
      }
    );
  };

  public render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
    };

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    return (
      <>
        <div>
          <Row>
            <Form style={{ marginBottom: '15px' }} layout="inline">
              <Form.Item {...formItemLayout}>
                <Select
                  value={this.state.filterItem}
                  onChange={this.handleChange}
                  style={{ width: '150px' }}
                >
                  <Option value="username">按用户名查询</Option>
                  <Option value="roleName">按角色筛选</Option>
                  <Option value="departmentId">按部门筛选</Option>
                </Select>
              </Form.Item>
              {this.state.filterItem === 'username' ? (
                <Form.Item {...formItemLayout}>
                  <Input
                    value={this.state.username}
                    onChange={this.onUserName}
                    onPressEnter={this.onSearch}
                    placeholder="请输入"
                    style={{ width: '200px' }}
                  />
                </Form.Item>
              ) : null}
              {this.state.filterItem === 'roleName' ? (
                <Form.Item {...formItemLayout}>
                  <Select
                    onChange={this.onRole}
                    allowClear={true}
                    placeholder="请选择"
                    style={{ width: '200px' }}
                    value={this.state.roleName}
                  >
                    {this.state.rolesList &&
                      this.state.rolesList.map(item => {
                        return (
                          <Option value={item.roleName} key={item.id}>
                            {item.roleName}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              ) : null}
              {this.state.filterItem === 'departmentId' ? (
                <Form.Item {...formItemLayout}>
                  <TreeSelect
                    value={this.state.departmentId}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeDefaultExpandAll={true}
                    onChange={this.onDepartment}
                    allowClear={true}
                    placeholder="请选择"
                    style={{ width: '200px' }}
                    value={this.state.departmentId}
                  >
                    {this.renderTreeNode(this.state.departmentTree)}
                  </TreeSelect>
                </Form.Item>
              ) : null}
              <Form.Item>
                <Button type="primary" onClick={this.onSearch} style={{ marginRight: '8px' }}>
                  查询
                </Button>
                <Button type="primary" onClick={this.onReset}>
                  重置
                </Button>
              </Form.Item>
            </Form>
          </Row>
          <Row style={{ marginBottom: '15px' }}>
            <Popconfirm title="确认操作?" onConfirm={this.onBatchAdd}>
              <Button type="primary">批量加入</Button>
            </Popconfirm>
          </Row>
          <Table
            rowSelection={rowSelection}
            columns={this.state.columns}
            dataSource={this.state.dataSource}
            rowKey={data => data.id}
            className={styles.userTable}
          />
        </div>
      </>
    );
  }
}

export default Operation;
