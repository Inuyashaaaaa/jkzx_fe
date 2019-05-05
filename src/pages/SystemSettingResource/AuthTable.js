import React, { Component } from 'react';
import { Table, Checkbox, Button, Input, Popconfirm } from 'antd';

import AUTHES from './constants';

const { Search } = Input;

export default class AuthTable extends Component {
  constructor(props) {
    super(props);
    // let authes = AUTHES[props.data.resourceType]
    // let authList = authes.map(a => {
    //   let obj = Object.assign({});
    //   obj.name = a;
    //   obj.choosed = false;
    //   return obj;
    // });

    this.state = {
      authorities: [],
      changed: false,
      currentLogin: false,
      loading: false,
    };
    setTimeout(() => {
      this.setAuthrities(props);
    }, 10);
  }

  componentWillReceiveProps(nextProps) {
    this.setAuthrities(nextProps);
  }

  setAuthrities = props => {
    const { data } = props;
    const permissions = data.resourcePermissions;
    const authes = AUTHES[data.resourceType];
    const authList = [];
    authes.forEach(a => {
      const obj = Object.assign({});
      obj.name = a.zh;
      obj.value = a.value;
      obj.choosed = permissions.includes(a.value);
      authList.push(obj);
    });
    this.auth_list = authList;
    this.setState({
      authorities: authList,
      changed: false,
      loading: false,
    });
  };

  handleCheck = record => {
    const result = Object.assign({}, record);
    result.choosed = !record.choosed;
    const { authorities } = this.state;
    const newAuthes = authorities;
    const index = newAuthes.findIndex(a => a.name === record.name);
    newAuthes[index] = result;
    this.auth_list = newAuthes;
    this.setState({
      authorities: newAuthes,
      changed: true,
      loading: false,
    });
  };

  chooseAll = () => {
    const { authorities } = this.state;
    const newAuthes = authorities;
    newAuthes.forEach(n => (n.choosed = true));
    this.auth_list = newAuthes;
    this.setState({
      authorities: newAuthes,
      changed: true,
    });
  };

  cancelAll = () => {
    const { authorities } = this.state;
    const newAuthes = authorities;
    newAuthes.forEach(n => (n.choosed = false));
    this.auth_list = newAuthes;
    this.setState({
      authorities: newAuthes,
      changed: true,
    });
  };

  submit = () => {
    const { authorities } = this.state;
    const permissions = [];
    authorities.forEach(a => {
      if (a.choosed) {
        permissions.push(a.value);
      }
    });
    this.setState({ loading: true });
    const { modifyResourceAuth, data } = this.props;
    modifyResourceAuth(permissions, data.id);
  };

  cancelLoading = () => {
    this.setState({
      loading: false,
    });
  };

  cancel = () => {
    this.setAuthrities(this.props);
  };

  generateColumns = () => {
    const columns = [
      {
        dataIndex: 'choosed',
        title: '赋权',
        render: (text, record) => {
          return <Checkbox checked={text} onChange={() => this.handleCheck(record)} />;
        },
      },
      {
        dataIndex: 'name',
        title: '权限',
      },
      {
        dataIndex: 'value',
        title: '权限(英文)',
      },
    ];
    return columns;
  };

  handleSearch = value => {
    this.setSearchResult(value);
  };

  cancelSearch = () => {
    this.setSearchResult();
  };

  setSearchResult = filter => {
    let authList = [];
    if (filter) {
      this.auth_list.forEach(a => {
        if (a.name.includes(filter) || a.value.includes(filter.toUpperCase())) {
          authList.push(a);
        }
      });
    } else {
      authList = [...this.auth_list];
    }
    console.log(authList);
    this.setState({
      authorities: authList,
    });
  };

  render() {
    const { data, removeResource, modifyResource } = this.props;
    const columns = this.generateColumns();
    const types = ['NAMESPACE', 'ROOT', 'PORTFOLIO', 'BOOK'];
    const typeNames = ['资源组', '资源组', '投资组合', '交易簿'];
    let typeDescription = '';
    const index = types.indexOf(data.resourceType.toUpperCase());
    if (index > 1) {
      typeDescription = ` （${typeNames[index]}）`;
    }
    const { currentLogin, changed, authorities, loading } = this.state;
    return (
      <div style={{ marginLeft: 100, width: 700 }}>
        <h2>
          <span style={{ color: '#08c' }}>{data.resourceName + typeDescription}</span> 权限列表
        </h2>
        {false && currentLogin && (
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <Button onClick={modifyResource} type="primary">
              更改当前资源
            </Button>
            <Popconfirm title={`确定要删除${data.resourceName}吗？`} onConfirm={removeResource}>
              <Button style={{ marginLeft: 10 }} type="danger">
                删除当前资源
              </Button>
            </Popconfirm>
          </div>
        )}
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Button onClick={this.chooseAll} type="primary" disabled={loading}>
            全选
          </Button>
          <Button
            onClick={this.cancelAll}
            type="primary"
            style={{ marginLeft: 10 }}
            disabled={loading}
          >
            全部取消
          </Button>
          {changed && (
            <Button
              onClick={this.submit}
              type="primary"
              loading={loading}
              style={{ marginLeft: 10 }}
            >
              提交更改
            </Button>
          )}
          {changed && (
            <Button
              style={{ marginLeft: 10 }}
              onClick={this.cancel}
              type="primary"
              disabled={loading}
            >
              取消更改
            </Button>
          )}
        </div>

        <div>
          <Search
            placeholder="请输入中英文筛选字段"
            style={{ width: 200, marginRight: 10 }}
            onSearch={this.handleSearch}
          />
          <Button onClick={this.cancelSearch}>取消筛选</Button>
        </div>
        <Table
          style={{ marginTop: 10 }}
          bordered={false}
          size="middle"
          pagination
          dataSource={authorities || []}
          columns={columns}
        />
      </div>
    );
  }
}
