import SourceTable from '@/design/components/SourceTable';
import { authRolesList } from '@/services/role';
import { authUserList } from '@/services/user';
import { Button, Form, Input, Row, Select, Table } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
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
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => <a onClick={() => this.onAdd(record.id)}>加入审批组</a>,
      },
    ],
    visible: false,
    username: '',
    roleName: '',
    rolesList: [],
    dataSource: [],
    loading: false,
    selectedRowKeys: [],
    selectArray: [],
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
    const requests = () => Promise.all([authRolesList(), authUserList()]);
    const [roles, users] = await requests();
    console.log(roles, users);

    if (roles.error || users.error) {
      this.setState({
        loading: false,
      });
      return false;
    }
    const { currentGroup } = this.props;
    const dataSource = users.data.filter(item => {
      return !currentGroup.userList.find(items => item.username === items.username);
    });
    // 过滤
    this.setState({
      loading: false,
      dataSource,
      selectedRowKeys: [],
      selectArray: [],
      rolesList: roles.data,
    });
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

  public onSearch = async () => {
    // 筛选条件
    const dataSource = this.state.dataSource.filter(item => {
      return item.username === this.state.username || item.roleName.includes(this.state.roleName);
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
    // 单个加入审批组
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
    console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRow);
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

  public render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      // onSelection: this.onSelection,
    };
    console.log('drawer');
    return (
      <>
        <div>
          <Row>
            <Form layout="inline" style={{ marginBottom: '15px' }}>
              <Form.Item label="用户名">
                <Input style={{ width: 120 }} onBlur={this.onUserName} />
              </Form.Item>
              <Form.Item label="角色">
                <Select style={{ width: 120 }} onChange={this.onRole}>
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
              <Form.Item>
                <Button type="primary" icon="search" onClick={this.onSearch} />
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
