import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, SmartTable, Table2 } from '@/containers';
import Page from '@/containers/Page';
import { authRolesList, createRole, queryAllPagePermissions } from '@/services/role';
import { Button, message, Modal } from 'antd';
import React, { PureComponent } from 'react';
import ResourceManagement from '../SystemSettingResource/ResourceManage';
import { FORM_CONTROL, TABLE_COL_DEF } from './constants';

class SystemSettingsRoleManagement extends PureComponent {
  public $table: Table2 = null;

  public $form: Form2 = null;

  public state = {
    dataSource: [],
    loading: false,
    visible: false,
    formData: {},
    displayResources: false,
    choosedRole: {},
    confirmLoading: false,
  };

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.fetchTable();
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

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const requests = () => Promise.all([authRolesList(), queryAllPagePermissions({})]);
    const [roles, allPagesPermissions] = await requests();

    if (roles.error || allPagesPermissions.error) {
      this.setState({
        loading: false,
      });
      return false;
    }

    const pageMap = {};
    const entityPageMap = {};
    this.handlePages(allPagesPermissions.data, pageMap, entityPageMap);
    const newPageMap = pageMap;
    const newEntityPageMap = entityPageMap;

    const dataSource = roles.data.map(item => {
      return {
        ...item,
        newPageMap,
      };
    });
    this.setState({
      loading: false,
      dataSource: dataSource.sort((role1, role2) => role1.roleName.localeCompare(role2.roleName)),
    });
    return;
  };

  public onConfirm = async () => {
    const validateRsp = await this.$form.validate();
    if (validateRsp.error) return;
    this.setState({ confirmLoading: true });
    const { error, data } = await createRole(Form2.getFieldsValue(this.state.formData));
    this.setState({ confirmLoading: false });
    if (error) {
      message.error('新建失败');
      return;
    }
    message.success('新建成功');
    this.setState({
      visible: false,
      formData: {},
    });
    this.fetchTable();
  };

  public handleFormChange = (porps, fields, allFields) => {
    this.setState({
      formData: allFields,
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

  public showModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  public render() {
    return (
      <>
        <Page>
          {!this.state.displayResources && (
            <>
              <Button
                type="primary"
                style={{ marginBottom: VERTICAL_GUTTER }}
                onClick={this.showModal}
              >
                新增
              </Button>
              <SmartTable
                ref={node => (this.$table = node)}
                rowKey={'id'}
                dataSource={this.state.dataSource}
                loading={this.state.loading}
                columns={TABLE_COL_DEF(this.fetchTable, this.showResource)}
              />
            </>
          )}
          {this.state.displayResources && (
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
                  角色：<span style={{ color: '#08c' }}>{this.state.choosedRole.roleName}</span>{' '}
                  数据权限列表
                </h2>
                <Button type="primary" onClick={this.hideResource}>
                  返回角色列表
                </Button>
              </div>
              <ResourceManagement info={{ type: 'role', detail: this.state.choosedRole }} />
            </div>
          )}
          <Modal
            visible={this.state.visible}
            title="新建角色"
            onOk={this.onConfirm}
            onCancel={this.showModal}
            confirmLoading={this.state.confirmLoading}
          >
            <Form2
              ref={node => (this.$form = node)}
              dataSource={this.state.formData}
              columns={FORM_CONTROL}
              footer={false}
              onFieldsChange={this.handleFormChange}
            />
          </Modal>
        </Page>
      </>
    );
  }
}

export default SystemSettingsRoleManagement;
