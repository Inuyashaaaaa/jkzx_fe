import { SmartTable } from '@/containers';
import Page from '@/containers/Page';
import {
  creatAuthDepartment,
  modifyAuthDepartment,
  moveAuthDepartment,
  queryAuthDepartmentList,
  removeAuthDepartment,
} from '@/services/department';
import { Button, Modal, notification, Popconfirm } from 'antd';
import React, { PureComponent } from 'react';
import CommonForm from './components/CommonForm';

const LEAF = '_$leaf_';
const EXTENDED = '_$extended_';
const LEVEL = '_$level_';
const CHILDREN = '_$children_';

export default class DepartmentManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      originDepartMents: {},
      modalType: 'create',
      modalVisible: false,
      formItems: [],
      loading: false,
      tableLoading: false,
    };
  }

  componentDidMount() {
    this.getDepartments();
  }

  sortDepartment = data => {
    if (!data) {
      return;
    }
    if (!(typeof data === 'object')) {
      return;
    }
    const { children } = data;
    if (children && children.length > 0) {
      children.sort((a, b) => {
        return a.departmentName.localeCompare(b.departmentName);
      });
      children.forEach(c => this.sortDepartment(c));
    }
  };

  getDepartments = async () => {
    this.setState({
      tableLoading: true,
    });
    try {
      const departments = await queryAuthDepartmentList({});
      this.setState({
        tableLoading: false,
      });

      if (departments && departments.data) {
        const tableData = [];
        this.handleDepartments(departments.data, '0', tableData);

        this.setState({
          data: tableData,
          originDepartMents: departments.data,
        });
        notification.success({
          message: '获取部门成功',
        });
      }
    } catch (e) {
      notification.error({
        message: '获取部门失败',
      });
    }
  };

  refreshTable = depart => {
    let { data } = this.state;
    // const origin = this.originDepartments;
    data = [...data];
    const hint = data.findIndex(d => d.id === depart.id);
    if (depart[EXTENDED]) {
      const level = depart[LEVEL];
      let count = 0;
      data.forEach(d => {
        if (d[LEVEL].startsWith(level)) {
          count += 1;
        }
      });
      data.splice(hint + 1, count - 1);
      data[hint][EXTENDED] = false;
    } else {
      const n = depart[CHILDREN].map((c, i) => {
        const newObj = Object.assign({});
        newObj[EXTENDED] = false;
        newObj[LEVEL] = `${depart[LEVEL]}-${i}`;
        newObj[EXTENDED] = false;
        newObj[LEAF] = !(c.children && c.children.length > 0);
        Object.keys(c).forEach(pro => {
          if (pro !== 'children') {
            newObj[pro] = c[pro];
          }
        });
        newObj[CHILDREN] = c.children;
        return newObj;
      });
      let temp = [];
      data.forEach((d, i) => {
        temp.push(d);
        if (i === hint) {
          temp = temp.concat(n);
        }
      });
      data = temp;
      data[hint][EXTENDED] = true;
    }
    this.setState({
      data,
    });
  };

  handleDepartments = (data, level, tableData) => {
    tableData = tableData || [];
    const newObj = Object.assign({});
    newObj[EXTENDED] = true;
    const isLeaf = !(data.children && data.children.length > 0);
    newObj[LEAF] = isLeaf;
    newObj[LEVEL] = level;
    Object.keys(data).forEach(pro => {
      if (pro !== 'children') {
        newObj[pro] = data[pro];
      }
    });
    newObj[CHILDREN] = data.children;
    tableData.push(newObj);
    if (!isLeaf) {
      data.children.forEach((child, i) =>
        this.handleDepartments(child, `${level}-${i}`, tableData)
      );
    }
  };

  setFormData = (value, property) => {
    const submitData = this.submitData || {};
    this.submitData = submitData;
    submitData[property] = value;
  };

  formatDepartmentItems = tag => {
    const departName = {
      type: 'text',
      label: '部门名称',
      property: 'departmentName',
      required: true,
    };
    const departType = {
      type: 'text',
      label: '部门类型',
      property: 'departmentType',
      required: true,
    };
    const departDescription = {
      type: 'textArea',
      label: '部门描述',
      property: 'description',
      required: false,
    };
    const { originDepartMents } = this.state;
    const parent = {
      type: 'treeSelect',
      label: '上级部门',
      property: 'parentId',
      display: 'departmentName',
      required: true,
      data: originDepartMents,
    };
    if (tag === 'create') {
      return [departName, departType, departDescription, parent];
    }
    if (tag === 'modify') {
      const temp = [departName, departType, departDescription];
      temp.forEach(t => {
        t.value = this.submitDepart[t.property] || '';
      });
      return temp;
    }
    if (tag === 'move') {
      return [parent];
    }
  };

  confirmUpdate = () => {
    this.$formBuilder &&
      this.$formBuilder.validateForm(values => {
        let finalObj = Object.assign({}, values);
        const submitDepart = this.submitDepart || {};
        const { modalType } = this.state;

        if (modalType === 'create') {
          finalObj.sort = 0;
        } else if (modalType === 'modify') {
          finalObj.departmentId = submitDepart.id;
        } else if (modalType === 'move') {
          if (submitDepart.id === finalObj.parentId) {
            notification.error({
              message: `上级部门不能为部门自己`,
            });
            return;
          }
          finalObj = {
            departmentId: submitDepart.id,
            parentId: finalObj.parentId,
          };
        }
        this.executeUpdate(finalObj, submitDepart);
      });
  };

  removeDepartmen = record => {
    const params = {
      departmentId: record.id,
    };

    this.executeUpdate(params, record, 'remove');
  };

  executeUpdate = async (params, department, action) => {
    let { modalType } = this.state;
    modalType = action || modalType;
    let executeMethod = creatAuthDepartment;
    let tip = '';
    switch (modalType) {
      case 'create':
        executeMethod = creatAuthDepartment;
        tip = `创建部门：${params.departmentName}`;
        break;
      case 'move':
        executeMethod = moveAuthDepartment;
        tip = `移动部门：${department.departmentName}`;
        break;
      case 'modify':
        executeMethod = modifyAuthDepartment;
        tip = `更新部门：${department.departmentName}`;
        break;
      case 'remove':
        executeMethod = removeAuthDepartment;
        tip = `删除部门：${department.departmentName}`;
        break;
      default:
        break;
    }
    this.setState({ loading: true });
    const res = await executeMethod(params);
    this.setState({ loading: false });
    if (res && res.data) {
      notification.success({
        message: `${tip}成功`,
      });
      this.hideModal();
      this.getDepartments();
    }
  };

  hideModal = () => {
    this.submitData = {};
    this.submitDepart = {};
    this.setState({
      modalVisible: false,
      formItems: [],
      loading: false,
    });
  };

  showModal = (action, record) => {
    this.submitDepart = record;
    this.setState({
      modalVisible: true,
      modalType: action,
      formItems: this.formatDepartmentItems(action),
    });
  };

  generateDepartmentColumns = () => {
    const columns = [
      {
        dataIndex: 'departmentName',
        title: '部门',
        key: 'departmentName',
        render: (text, record) => {
          let level = record[LEVEL].split('-');
          level = level.length - 1;
          const extend = record[EXTENDED];
          const leaf = record[LEAF];
          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginLeft: level * 15,
              }}
            >
              {leaf ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 28,
                    height: 22,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderWidth: 2,
                      borderStyle: 'solid',
                      borderColor: '#08c',
                      borderRadius: 5,
                    }}
                  />
                </div>
              ) : extend ? (
                <Button
                  icon="caret-down"
                  size="small"
                  onClick={() => this.refreshTable(record)}
                  style={{ fontSize: 12, color: '#08c', border: 0 }}
                />
              ) : (
                <Button
                  icon="caret-right"
                  size="small"
                  onClick={() => this.refreshTable(record)}
                  style={{ fontSize: 12, color: '#08c', border: 0 }}
                />
              )}
              <div>{text}</div>
            </div>
          );
        },
      },
      {
        dataIndex: 'departmentType',
        title: '部门类型',
        key: 'departmentType',
      },
      {
        dataIndex: 'description',
        title: '描述',
        key: 'description',
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record) => {
          const isChild = !!record.parentId;

          return isChild ? (
            <div>
              <Button onClick={() => this.showModal('modify', record)}>更新</Button>
              <Button onClick={() => this.showModal('move', record)} style={{ marginLeft: 10 }}>
                移动
              </Button>
              <Popconfirm title="确定要删除吗？" onConfirm={() => this.removeDepartmen(record)}>
                <Button type="danger" style={{ marginLeft: 10 }}>
                  删除
                </Button>
              </Popconfirm>
            </div>
          ) : (
            <div>
              <Button onClick={() => this.showModal('modify', record)}>更新</Button>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  render() {
    const { data, modalType } = this.state;
    const columns = this.generateDepartmentColumns();
    let modalTitle = '';
    switch (modalType) {
      case 'create':
        modalTitle = '创建部门';
        break;
      case 'move':
        modalTitle = '更改上级部门';
        break;
      case 'modify':
        modalTitle = '更改部门信息';
        break;
      default:
        break;
    }
    const { modalVisible, loading, formItems, tableLoading } = this.state;
    return (
      <Page>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Button type="primary" onClick={() => this.showModal('create')}>
            创建部门
          </Button>
        </div>
        <SmartTable
          bordered
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={data}
          pagination={false}
          loading={tableLoading}
        />
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onCancel={this.hideModal}
          onOk={this.confirmUpdate}
          footer={[
            <Button key="back" size="large" onClick={this.hideModal}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              size="large"
              loading={loading}
              onClick={this.confirmUpdate}
            >
              确认
            </Button>,
          ]}
        >
          {modalVisible && (
            <CommonForm
              data={formItems}
              handleChange={this.setFormData}
              ref={ele => (this.$formBuilder = ele)}
            />
          )}
        </Modal>
      </Page>
    );
  }
}
