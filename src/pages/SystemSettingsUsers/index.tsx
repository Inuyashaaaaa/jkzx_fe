import { Form2, Table2 } from '@/containers';
import { VERTICAL_GUTTER } from '@/constants/global';
import PopconfirmButton from '@/containers/PopconfirmButton';
import SourceTable from '@/containers/SourceTable';
import Page from '@/containers/Page';
import { queryAuthDepartmentList } from '@/services/department';
import { authRolesList } from '@/services/role';
import { authUserList, createUser, updateUser } from '@/services/user';
import { Button, Col, message, Modal, notification, Row } from 'antd';
import React, { PureComponent } from 'react';
import ResourceManagement from '../SystemSettingResource/ResourceManage';
import { CREATE_FORM_CONTROLS } from './constants';
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

function departmentsTreeData(departments) {
  function getChild(params) {
    if (params.children) {
      return {
        title: params.departmentName,
        value: params.id,
        key: params.id,
        children: params.children.map(item => getChild(item)),
      };
    }
    return {
      title: params.departmentName,
      value: params.id,
      key: params.id,
    };
  }
  return departments && getChild(departments);
}

class SystemSettingsUsers extends PureComponent {
  public rowKey = 'id';

  public $sourceTable: Table2 = null;

  public $form: Form2 = null;

  public state = {
    roleOptions: [],
    loading: false,
    formData: {},
    users: [],
    modalVisible: false,
    displayResources: false,
    choosedUser: {},
    departments: [],
    confirmLoading: false,
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
    this.setState({
      departments,
    });
    users.forEach(user => {
      const department = findDepartment(departments, user.departmentId);
      user.departmentName = department.departmentName || '';
      user.userTypeName = user.userType === 'SCRIPT' ? '脚本用户' : '普通用户';
      user.roles = {
        type: 'field',
        value: user.roleName.map(role => {
          const hint = roles.find(item => item.roleName === role);
          return hint && hint.id;
        }),
      };
    });
    this.setState({
      roleOptions: roles.map(item => {
        return {
          value: item.id,
          label: item.roleName,
        };
      }),
      users: users.sort((a, b) => a.username.localeCompare(b.username)),
    });
  };

  public showModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  public showResources = rowData => {
    this.setState({
      displayResources: true,
      choosedUser: rowData,
    });
  };

  public hideResource = () => {
    this.setState({
      displayResources: false,
    });
  };

  public handleCellValueChanged = async params => {
    const { changedFields, record } = params;
    this.setState({
      users: this.state.users.map(item => {
        if (item.id === params.rowId) {
          return {
            ...item,
            ...params.changedFields,
          };
        }
        return item;
      }),
    });
    // const res = await updateUserRole({
    //   userId: data.id,
    //   roleIds: newValue,
    // });
    // if (res.error) return;
    // notification.success({
    //   message: '更新角色成功',
    // });
  };

  public onCreate = async () => {
    const validateRsp = await this.$form.validate();
    if (validateRsp.error) return;
    this.setState({ confirmLoading: true });
    const { error, data } = await createUser(
      _.omit(Form2.getFieldsValue(this.state.formData), 'confirmpassword')
    );
    this.setState({ confirmLoading: false });
    if (error) {
      message.error('新建失败');
      return;
    }
    message.success('新建成功');
    this.setState({
      modalVisible: false,
      formData: {},
    });
    this.fetchData();
  };

  public handleFieldsChangeCreate = (props, fields, allFields) => {
    this.setState({
      formData: allFields,
    });
  };

  public render() {
    const {
      displayResources,
      choosedUser,
      users,
      loading,
      modalVisible,
      formData,
      confirmLoading,
    } = this.state;

    return (
      <Page>
        {!displayResources && (
          <>
            <Row type="flex" justify="start" style={{ marginBottom: VERTICAL_GUTTER }}>
              <Col>
                <Button type="primary" onClick={this.showModal}>
                  新建用户
                </Button>
              </Col>
            </Row>
            <Table2
              loading={loading}
              ref={node => (this.$sourceTable = node)}
              rowKey={this.rowKey}
              dataSource={users}
              columns={createPageTableColDefs(
                this.state.roleOptions,
                this.showResources,
                departmentsTreeData(this.state.departments),
                this.fetchData
              )}
              size={'middle'}
              scroll={{ x: 1800 }}
              onCellFieldsChange={this.handleCellValueChanged}
            />
          </>
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
                用户：<span style={{ color: '#08c' }}>{choosedUser.username}</span> 数据权限列表
              </h2>
              <Button type="primary" onClick={this.hideResource}>
                返回用户列表
              </Button>
            </div>
            <ResourceManagement info={{ type: 'user', detail: choosedUser }} />
          </div>
        )}
        <Modal
          title={'新建用户'}
          visible={modalVisible}
          onCancel={this.showModal}
          onOk={this.onCreate}
          width={600}
          confirmLoading={confirmLoading}
        >
          <Form2
            ref={node => (this.$form = node)}
            dataSource={formData}
            onFieldsChange={this.handleFieldsChangeCreate}
            footer={false}
            columns={CREATE_FORM_CONTROLS(
              departmentsTreeData(this.state.departments),
              this.state.roleOptions
            )}
          />
        </Modal>
      </Page>
    );
  }
}

export default SystemSettingsUsers;
