import SourceTable from '@/design/components/SourceTable';
import { authUserList } from '@/services/user';
import { Button, Col, Drawer, Form, Input, message, Row, Select, Table } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import styles from './auditing.less';
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
        render: (text, record) => <a>加入审批组</a>,
      },
    ],
    visible: false,
    username: '',
    roleName: '',
    role: '',
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
    const { data, error } = await authUserList();
    const { currentGroup } = this.props;
    const dataSource = data.filter(item => {
      return !currentGroup.userList.find(items => item.username === items.username);
    });
    if (error) {
      return this.setState({
        loading: false,
      });
    }
    // 过滤
    this.setState({
      loading: false,
      dataSource,
    });
    return;
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
      role: e,
    });
  };

  public onSearch = async () => {
    // 筛选条件
    const { data, error, raw } = await authUserList({
      username: this.state.username,
      roleName: this.state.roleName,
    });
    if (error) {
      return this.setState({
        loading: false,
      });
    }
    this.setState({
      loading: false,
      dataSource: data,
    });
  };

  public onBatchAdd = () => {
    this.props.onBatchAdd(this.state.selectArray);
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
                  <Option value="rmb">RMB</Option>
                  <Option value="dollar">Dollar</Option>
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
          />
        </div>
      </>
    );
  }
}

export default Operation;
