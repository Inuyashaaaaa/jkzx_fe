import { VERTICAL_GUTTER } from '@/constants/global';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { queryAuthDepartmentList } from '@/services/department';
import { authRolesList } from '@/services/role';
import {
  authUserList,
  createUser,
  deleteUser,
  expireUser,
  lockUser,
  saveUserPasswordByAdmin,
  unexpireUser,
  unlockUser,
  updateUser,
  updateUserRole,
} from '@/services/user';
import { Button, Col, message, Modal, notification, Row } from 'antd';
import produce from 'immer';
import React, { PureComponent } from 'react';
import FormBuilder from '../SystemSettingDepartment/components/CommonForm';
import ResourceManagement from '../SystemSettingResource/ResourceManage';
import PasswordModify from './PasswordModify';
import { createPageTableColDefs } from './services';

function findDepartment(departs, departId) {
  let hint = {};
  function inner(d) {
    if (d.id === departId) {
      hint = d;
      return;
    }
    const children = d.children;
    if (children && children.length > 0) {
      const target = children.find(c => c.id === departId);
      if (target) {
        hint = target;
        return;
      } else {
        children.forEach(c => inner(c));
      }
    }
  }
  inner(departs);
  return hint;
}

class SystemSettingsUsers extends PureComponent {
  public rowKey = 'id';

  public $sourceTable: SourceTable = null;

  public initialFetchTableData = null;

  public choosedUser = null;

  public state = {
    roleOptions: [],
    loading: false,
    formData: {},
    saveLoading: false,
    rowData: [],
    canSave: false,
    users: [],
    modalTitle: '',
    modalVisible: false,
    modalOKLoading: false,
    expireLoading: false,
    displayResources: false,
    choosedUser: {},
    formBuilderItems: [],
    laoding: false,
  };

  public componentDidMount = () => {
    this.fetchData();
  };

  public fetchData = async () => {
    this.setState({ loading: true });
    const rsps = await Promise.all([authUserList(), authRolesList(), queryAuthDepartmentList({})]);
    this.setState({ loading: false });

    if (rsps.some(item => item.error)) return;

    const [usersRes, rolesRes, departmentsRes] = rsps;
    const departments = departmentsRes.data || {};
    const users = usersRes.data || [];
    const roles = rolesRes.data || [];
    this.departments = departments;
    users.forEach(user => {
      const department = findDepartment(departments, user.departmentId);
      user.departmentName = department.departmentName || '';
      user.userTypeName = user.userType === 'SCRIPT' ? '脚本用户' : '普通用户';
      user.roles = user.roleName.map(role => {
        const hint = roles.find(item => item.roleName === role);
        return hint && hint.id;
      });
    });
    this.setState({
      roleOptions: roles.map(item => {
        return {
          value: item.id,
          label: item.roleName,
          ...item,
        };
      }),
      users: users.sort((a, b) => a.username.localeCompare(b.username)),
      loading: false,
    });
  };

  public fetchTable = async () => {
    const { error, data } = await authUserList();
    if (error) return false;
    data.forEach(dataItem => {
      dataItem.roles.forEach(item => {
        item.value = item.uuid;
        item.label = item.roleName;
      });
    });
    return data;
  };

  public onRemove = async params => {
    const { rowId, rowIndex } = params;
    const res = await deleteUser({ userId: rowId });
    if (res.error) {
      return;
    }

    this.setState(
      produce((state: any) => {
        state.users.splice(rowIndex, 1);
      }),
      () => {
        notification.success({
          message: '删除成功',
        });
      }
    );
  };

  public onCreateUser = async stationalData => {
    const { createFormData, tableDataSource } = stationalData;
    const { error, data } = await createUser(createFormData);
    if (error) return false;

    return {
      tableDataSource: tableDataSource.concat(data),
    };
  };

  public lockUser = async event => {
    const user = event.rowData;
    const nextLockStatus = !user.locked;
    const params = {
      username: user.username,
    };

    const executeMethod = nextLockStatus ? lockUser : unlockUser;

    const { error } = await executeMethod(params);

    if (error) return false;

    const tips = nextLockStatus ? '锁定成功' : '解锁成功';

    notification.success({
      message: tips,
    });

    return () => {
      this.setState(
        produce((state: any) => {
          const user = state.users.find(user => user[this.rowKey] === event.rowId);
          if (!user) return;
          user.locked = nextLockStatus;
        }),
        () => this.$sourceTable && this.$sourceTable.refresh()
      );
    };
  };

  public expireUser = async event => {
    const user = event.rowData;
    const nextExpireStatus = !user.expired;
    const params = {
      username: user.username,
    };

    const executeMethod = nextExpireStatus ? expireUser : unexpireUser;
    const { error } = await executeMethod(params);

    if (error) return false;

    const tips = nextExpireStatus ? '密码过期成功' : '使密码有效成功';
    notification.success({
      message: tips,
    });

    return buttonContext => {
      this.setState(
        produce((state: any) => {
          const user = state.users.find(user => user[this.rowKey] === event.rowId);
          if (!user) return;
          user.expired = nextExpireStatus;
        }),
        () => {
          if (this.$sourceTable) {
            this.$sourceTable.refresh();
          }
        }
      );
    };
  };

  public resetPassword = async e => {
    this.choosedUser = e.rowData;
    this.showModal({ modalTitle: '重置密码' });
  };

  public updateUser = async e => {
    this.choosedUser = e.rowData;
    this.showModal({
      formBuilderItems: this.formatFormBuliderItems('modify', this.choosedUser),
      modalTitle: '更新用户',
    });
  };

  public createUser = e => {
    this.showModal({
      formBuilderItems: this.formatFormBuliderItems('create'),
      modalTitle: '新建用户',
    });
  };

  public executeModifyUser = async params => {
    const { modalTitle, choosedUser, roleOptions } = this.state;
    const isCreate = modalTitle === '新建用户';
    const action = isCreate ? 'create' : 'modify';
    const finalObj = { ...params };
    if (isCreate) {
      const roleNames = finalObj.roleIds || [];
      if (roleOptions && roleOptions.length > 0) {
        finalObj.roleIds = roleNames.map(name => {
          const role = roleOptions.find(r => r.roleName === name || r.id === name);
          return role.id;
        });
      }
    } else {
      finalObj.userId = this.choosedUser.id;
    }
    this.setState({ modalOKLoading: true });
    finalObj.userType = finalObj.userType === '普通用户' ? 'NORMAL' : 'SCRIPT';
    const hintMethod = isCreate ? createUser : updateUser;
    const res = await hintMethod(finalObj);
    this.setState({ modalOKLoading: false });
    if (res && res.data) {
      const tip = isCreate ? '创建' : '更新';
      notification.success({
        message: `${tip}用户成功`,
      });
      this.fetchData();
      this.hideModal();
    }
  };

  public setFormBuilderInfo = (value, property) => {
    this.newUser = this.newUser || {};
    const user = this.newUser;
    user[property] = value;
  };

  public formatFormBuliderItems = (action, record) => {
    const { roleOptions, users } = this.state;
    const userName = {
      type: 'text',
      label: '用户名',
      property: 'username',
      required: true,
    };
    const password = {
      type: 'password',
      label: '密码',
      property: 'password',
      required: true,
      placeholder: '至少一位数字、字母以及其他特殊字符，且不少于8位',
      rule: value => {
        const reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z]).{8,30}/;
        if (value && !reg.test(value)) {
          return '密码必须包含至少一位数字、字母、以及其他特殊字符，且不小于8位';
        }
      },
    };
    const confirmPass = {
      type: 'password',
      label: '确认密码',
      property: 'confirmPass',
      required: true,
      placeholder: '请与密码保持一致',
      rule(value) {
        if (value !== this.password) {
          return '必须与密码保持一致';
        }
      },
    };
    const userType = {
      type: 'select',
      label: '用户类型',
      property: 'userType',
      required: true,
      options: ['普通用户', '脚本用户'],
    };
    const nickName = {
      type: 'text',
      label: '用户昵称',
      property: 'nickName',
      required: false,
    };
    const email = {
      type: 'text',
      label: '邮箱',
      property: 'contactEmail',
      required: false,
    };
    const role = {
      type: 'multiSelect',
      label: '角色',
      property: 'roleIds',
      required: false,
      options: roleOptions.map(role => role.roleName),
    };
    const department = {
      type: 'treeSelect',
      label: '部门',
      property: 'departmentId',
      display: 'departmentName',
      required: true,
      data: this.departments,
      disabled: action === 'modify' && record.username === 'admin' ? true : false,
    };
    if (action === 'create') {
      return [userName, password, confirmPass, department, userType, nickName, email, role];
    }
    if (action === 'modify') {
      let user = users.find(item => item.id === record.id);
      user = { ...user };
      user.userType = user.userType === 'NORMAL' ? '普通用户' : '脚本用户';
      const modifrA = [userName, department, userType, nickName, email];
      modifrA.forEach(item => {
        item.value = user[item.property] || '';
      });
      this.userOnModify = user;
      const department1 = (this.userOnModifyDepartment = findDepartment(
        this.departments,
        user.departmentId
      ));
      department1.value = department1.departmentName;
      return modifrA;
    }
  };

  public showModal = nextState => {
    this.setState({
      modalVisible: true,
      ...nextState,
    });
  };

  public hideModal = () => {
    this.setState({
      modalVisible: false,
      modalOKLoading: false,
    });
  };

  public handlePwd = () => {
    // this.hidePwd();
    this.PwdModify.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          modalOKLoading: true,
        });
        const { password } = values;
        const params = {
          userId: this.choosedUser.id,
          password,
        };
        saveUserPasswordByAdmin(params).then(res => {
          if (res.error) {
            return;
          }
          this.hideModal();
          notification.success({
            message: `重置${this.choosedUser.username}密码成功`,
          });
        });
      }
    });
  };

  public handleModalOK = () => {
    const { modalTitle } = this.state;
    if (modalTitle === '重置密码') {
      this.handlePwd();
    } else {
      // this.executeModifyUser();
      if (this.$formBuilder) {
        this.$formBuilder.validateForm(values => {
          this.executeModifyUser(values);
        });
      }
    }
  };

  public showResources = rowData => {
    this.setState({
      displayResources: true,
      choosedUser: rowData,
    });
  };

  public getRowActions = event => {
    const { rowData } = event;
    const { locked, expired } = rowData;
    return [
      <Button key="remove" type="danger" onClick={this.onRemove}>
        删除
      </Button>,
      <Button key="password" type="primary" onClick={this.resetPassword}>
        重置密码
      </Button>,
      <Button key="lock" type="primary" onClick={this.lockUser}>
        {!locked ? '锁定用户' : '解锁用户'}
      </Button>,
      <Button key="expire" type="primary" onClick={this.expireUser}>
        {expired ? '使用户在期' : '过期用户'}
      </Button>,
      <Button key="user" type="primary" onClick={this.updateUser}>
        修改用户
      </Button>,
      <Button key="resource" type="primary" onClick={async () => this.showResources(rowData)}>
        资源权限
      </Button>,
    ];
  };
  public hideResource = () => {
    this.setState({
      displayResources: false,
    });
  };

  public handleCellValueChanged = async params => {
    const { newValue, data } = params;
    const res = await updateUserRole({
      userId: data.id,
      roleIds: newValue,
    });
    if (res.error) return;
    notification.success({
      message: '更新角色成功',
    });
  };

  public render() {
    const {
      displayResources,
      choosedUser,
      modalVisible,
      modalOKLoading,
      modalTitle,
      formBuilderItems,
      users,
      loading,
    } = this.state;
    return (
      <PageHeaderWrapper>
        {!displayResources && (
          <SourceTable
            header={
              <Row type="flex" justify="start" style={{ marginBottom: VERTICAL_GUTTER }}>
                <Col>
                  <Button type="primary" onClick={this.createUser}>
                    新建用户
                  </Button>
                </Col>
              </Row>
            }
            loading={loading}
            ref={node => (this.$sourceTable = node)}
            searchable={false}
            rowKey={this.rowKey}
            dataSource={users}
            columnDefs={createPageTableColDefs(this.state.roleOptions)}
            rowActions={this.getRowActions}
            actionColDef={{
              width: 450,
              pinned: 'right',
            }}
            autoSizeColumnsToFit={false}
            onCellValueChanged={this.handleCellValueChanged}
          />
        )}
        {displayResources && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 0,
                marginBottom: 10,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: '#e5e5e5',
              }}
            >
              <h2>
                用户：<span style={{ color: '#08c' }}>{choosedUser.username}</span> 资源权限列表
              </h2>
              <Button type="primary" onClick={this.hideResource}>
                返回用户列表
              </Button>
            </div>
            <ResourceManagement info={{ type: 'user', detail: choosedUser }} />
          </div>
        )}
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onCancel={this.hideModal}
          onOk={this.handleModalOK}
          width={600}
          footer={
            <div>
              <Button type="primary" onClick={this.hideModal}>
                取消
              </Button>
              <Button type="primary" onClick={this.handleModalOK} loading={modalOKLoading}>
                确认
              </Button>
            </div>
          }
        >
          {modalTitle === '重置密码' ? (
            <PasswordModify ref={node => (this.PwdModify = node)} />
          ) : (
            modalVisible && (
              <FormBuilder
                data={formBuilderItems}
                handleChange={this.setFormBuilderInfo}
                ref={ele => (this.$formBuilder = ele)}
              />
            )
          )}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default SystemSettingsUsers;
