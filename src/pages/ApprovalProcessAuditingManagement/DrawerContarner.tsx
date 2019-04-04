import {
  authPagePermissionGetByRoleId,
  deleteRole,
  updateRolePagePermissions,
} from '@/services/role';
import SourceTable from '@/design/components/SourceTable';
import { Button, Col, Drawer, message, Row, Form, Input, Select, Table } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import styles from './auditing.less';
const { Option } = Select;

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
    render: () => <a>加入审批组</a>,
  },
];

class Operation extends PureComponent {
  public $sourceTable: SourceTable = null;

  public state = {
    visible: false,
    userName: '',
    role: '',
    dataSource: [
      {
        name: 'aa',
      },
    ],
    loading: false,
    selectedRowKeys: [],
  };

  constructor(props) {
    super(props);
  }

  public onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onUserName = e => {
    this.setState({
      userName: e.target.value,
    });
  };

  onRole = e => {
    this.setState({
      role: e,
    });
  };

  onSearch = () => {
    // 筛选条件
  };

  onAdd = () => {
    console.log(1);
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  public render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      // onSelection: this.onSelection,
    };

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
            <Button type="primary" onClick={this.onAdd}>
              批量加入
            </Button>
          </Row>
          <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.dataSource} />
        </div>
      </>
    );
  }
}

export default Operation;
