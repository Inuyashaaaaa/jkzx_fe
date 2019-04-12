import Form from '@/design/components/Form';
import ModalButton from '@/design/components/ModalButton';
import SourceTable from '@/design/components/SourceTable';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import { authRolesList, createRole, queryAllPagePermissions, updateRole } from '@/services/role';
import { Button, message, Row } from 'antd';
import React, { PureComponent } from 'react';
import ResourceManagement from '../SystemSettingResource/ResourceManage';
import { FORM_CONTROL, TABLE_COL_DEF } from './constants';

const pagesCollection = [
  'default',
  'dashboard',
  'userInfo',
  'tradeManagement',
  'booking',
  'contractManagement',
  'pricing',
  'notifications',
  'marketManagement',
  'subjectStore',
  'bookEdit',
  'onBoardTransaction',
  'pricingSettings',
  'volSurface',
  'riskFreeCurve',
  'dividendCurve',
  'baseContractManagement',
  'pricingEnvironment',
  'clientManagement',
  'clientInfo',
  'documentManagement',
  'customSalesManage',
  'customValuation',
  'customInfo',
  'bankAccount',
  'workflowManagement',
  'workflowSettings',
  'processManagement',
  'reports',
  'spotLadder',
  'eodPosition',
  'eodRiskByUnderlyer',
  'eodDailyPnlByUnderlyer',
  'eodHistoricalPnlByUnderlyer',
  'tradingStatements',
  'fundsDetailedStatements',
  'customerFundsSummaryStatements',
  'riskManager',
  'intradayPositionReport',
  'intradayRiskByUnderlyerReport',
  'intradayDailyPnlByUnderlyerReport',
  'intradayExpiringPositionReport',
  'systemSettings',
  'users',
  // 'roles',
  'roleManagement',
  'department',
  'resources',
  'tradeBooks',
  'volatilityCalendar',
  'calendars',
  'riskSettings',
  'approvalProcessManagement',
  'approvalAuditingManagement',
  'customReport',
  'portfolioManagement',
  'tradeDocuments',
  'portfolioRisk',
];

class SystemSettingsRoleManagement extends PureComponent {
  public $sourceTable: SourceTable = null;

  public $form: Form = null;

  public state = {
    dataSource: [],
    loading: false,
    visible: false,
    formData: {},
    displayResources: false,
    choosedRole: {},
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

  public onClick = () => {
    this.setState({
      visible: true,
    });
  };

  public onCancel = async () => {
    this.setState({
      visible: false,
    });
  };

  public onConfirm = async () => {
    this.setState({
      visible: false,
    });
    const { error, data } = await createRole(this.state.formData);
    if (error) {
      message.error('新建失败');
      return;
    }
    message.success('新建成功');
    this.fetchTable();
    return;
  };

  public handleFormChange = params => {
    this.setState({
      formData: params.values,
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

  public onCellValueChanged = async event => {
    const { error, data } = await updateRole({
      ...event.data,
      roleId: event.data.id,
    });
    if (error) return;
  };

  public render() {
    return (
      <>
        <PageHeaderWrapper>
          {!this.state.displayResources && (
            <SourceTable
              ref={node => (this.$sourceTable = node)}
              rowKey={'id'}
              dataSource={this.state.dataSource}
              loading={this.state.loading}
              columnDefs={TABLE_COL_DEF(this.fetchTable, this.showResource)}
              onCellValueChanged={this.onCellValueChanged}
              header={
                <Row style={{ marginBottom: '10px' }}>
                  <ModalButton
                    modalProps={{
                      title: '',
                      visible: this.state.visible,
                      onCancel: this.onCancel,
                      onOk: this.onConfirm,
                    }}
                    size="default"
                    type="primary"
                    onClick={this.onClick}
                    content={
                      <Form
                        wrappedComponentRef={element => {
                          if (element) {
                            this.$form = element.props.form;
                          }
                          return;
                        }}
                        dataSource={this.state.formData}
                        controls={FORM_CONTROL}
                        onValueChange={this.handleFormChange}
                        controlNumberOneRow={1}
                        footer={false}
                      />
                    }
                  >
                    新增
                  </ModalButton>
                </Row>
              }
            />
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
        </PageHeaderWrapper>
      </>
    );
  }
}

export default SystemSettingsRoleManagement;
