import SourceTable from '@/design/components/SourceTable';
import { queryAuthDepartmentList } from '@/services/department';
import { authRolesList } from '@/services/role';
import { authUserList } from '@/services/user';
import { Button, Form, Input, Row, Select, Table, TreeSelect } from 'antd';
import Item from 'antd/lib/list/Item';
import _ from 'lodash';
import React, { PureComponent } from 'react';

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
        render: (text, record) => <a onClick={() => this.onAdd(record.id)}>加入审批组</a>,
      },
    ],
    departmentTree: [],
    visible: false,
    username: '',
    roleName: '',
    rolesList: [],
    dataSource: [],
    loading: false,
    selectedRowKeys: [],
    selectArray: [],
    departmentId: undefined,
    array: [],
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
    this.setState({
      loading: false,
      dataSource,
      selectedRowKeys: [],
      selectArray: [],
      rolesList: roles.data,
      departmentTree,
    });
  };

  public toArray = data => {
    let array = [];
    let children = data.children || [];
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
    const dataSource = this.state.dataSource.filter(item => {
      return (
        item.username === this.state.username ||
        item.roleName.includes(this.state.roleName) ||
        item.departmentId === this.state.departmentId
      );
    });
    this.setState({
      dataSource,
    });
  };

  public onBatchAdd = () => {
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
            <Form style={{ marginBottom: '15px' }}>
              <Form.Item label="用户名" {...formItemLayout}>
                <Input onBlur={this.onUserName} />
              </Form.Item>
              <Form.Item label="角色" {...formItemLayout}>
                <Select onChange={this.onRole}>
                  {this.state.rolesList &&
                    this.state.rolesList.map(item => {
                      return (
                        <Option value={item.roleName} key={item.id}>
                          {item.alias}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
              <Form.Item label="部门" {...formItemLayout}>
                <TreeSelect
                  value={this.state.departmentId}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeDefaultExpandAll={true}
                  onChange={this.onDepartment}
                >
                  {this.renderTreeNode(this.state.departmentTree)}
                </TreeSelect>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon="search"
                  onClick={this.onSearch}
                  style={{ float: 'right' }}
                />
              </Form.Item>
            </Form>
          </Row>
          <Row style={{ marginBottom: '15px' }}>
            <Button type="primary" onClick={this.onBatchAdd}>
              批量加入
            </Button>
          </Row>
          <Table
            rowSelection={rowSelection}
            columns={this.state.columns}
            dataSource={this.state.dataSource}
            rowKey={data => data.id}
          />
        </div>
      </>
    );
  }
}

export default Operation;
