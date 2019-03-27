import SourceTable from '@/lib/components/_SourceTable';
import Table from '@/lib/components/_Table2';
import PageHeaderWrapper from '@/lib/components/PageHeaderWrapper';
import {
  authRolesList,
  createRole,
  deleteRole,
  queryAllPagePermissions,
  queryRolePagePermissions,
  updateRole,
  updateRolePagePermissions,
} from '@/services/role';
import { Button, notification } from 'antd';
import React, { PureComponent } from 'react';
import ResourceManagement from '../SystemSettingResource/ResourceManage';
import { CREATE_FORM_CONTROLS, PAGE_TABLE_COL_DEFS } from './constants';

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
  'roles',
  'department',
  'resources',
  'tradeBooks',
  'volatilityCalendar',
  'calendars',
  'riskSettings',
  'help',
  'userGuide',
  'developmentGuide',
  'approvalProcessManagement',
  'customReport',
  'portfolioManagement',
  'tradeDocuments',
];

function handlePages(data, result1, result2) {
  const { pageName, id, children } = data;
  result1[pageName] = id;
  if (children) {
    children.forEach(child => handlePages(child, result1, result2));
  } else {
    result2[pageName] = id;
  }
}

class SystemSettingsPermissions extends PureComponent {
  public $table: Table = null;

  public initialFetchTableData = null;

  public state = {
    formData: {},
    rowData: [],
    loading: false,
    canSave: false,
    saveLoading: false,
    loading: false,
    roles: [],
    displayResources: false,
  };

  public componentDidMount() {
    this.fetchTable();
  }

  public fetchTable = async () => {
    this.setState({
      loading: true,
    });
    const requests = () =>
      Promise.all([authRolesList(), queryRolePagePermissions({}), queryAllPagePermissions({})]);
    const [roles, rolePermissions, allPagesPermissions] = await requests();
    if (roles.error || rolePermissions.error || allPagesPermissions.error) {
      this.setState({
        loading: false,
      });
      return false;
    }
    const pageMap = {};
    const entityPageMap = {};
    handlePages(allPagesPermissions.data, pageMap, entityPageMap);
    this.pageMap = pageMap;
    this.entityPageMap = entityPageMap;
    const permissions = rolePermissions.data || [];
    const roleData = roles.data || [];
    roleData.forEach(role => {
      const permission = permissions.find(p => p.roleId === role.id);
      const permissionIds = (permission && permission.pageComponentId) || [];
      pagesCollection.forEach(page => {
        const id = pageMap[page];
        role[page] = permissionIds.includes(id);
      });
    });
    this.setState({
      loading: false,
      roles: roleData.sort((a, b) => a.roleName.localeCompare(b.roleName)),
    });
    return;
  };

  public onRemove = async id => {
    const { rowData } = id;
    const res = await deleteRole({ roleId: rowData.id });
    if (res.error) {
      return false;
    } else {
      notification.success({
        message: '删除成功',
      });
      this.fetchTable();
    }
    return true;
  };

  public onCreateRole = async event => {
    // console.log(event);
    return createRole(event.createFormData).then(rp => {
      if (rp.error) return false;
      this.fetchTable();
      return true;
    });
  };

  public showResources = data => {
    this.setState({
      displayResources: true,
      choosedRole: data,
    });
  };
  public hideResource = () => {
    this.setState({
      displayResources: false,
    });
  };

  public getRowActions: ISourceTableRowActions = event => {
    const { rowData } = event;
    return [
      <Button key="resource" type="primary" onClick={() => this.showResources(rowData)}>
        数据权限
      </Button>,
    ];
  };
  public handleCellValueChanged = async e => {
    const { data, column } = e;
    const colId = column.colId;
    let executeMethod = updateRole;
    let params = { roleId: data.id, ...data };
    if (pagesCollection.includes(colId)) {
      executeMethod = updateRolePagePermissions;
      const permissions = [];
      pagesCollection.forEach(name => {
        const pageId = this.entityPageMap[name];
        if (data[name] && pageId) {
          permissions.push(pageId);
        }
      });
      params = {
        permissions: [
          {
            roleId: data.id,
            pageComponentId: permissions,
          },
        ],
      };
    }
    const res = await executeMethod(params);
    this.fetchTable();
  };

  public render() {
    const { roles, loading, displayResources, choosedRole } = this.state;
    return (
      <PageHeaderWrapper>
        {!displayResources && (
          <SourceTable
            loading={loading}
            searchable={false}
            removeable={false}
            saveDisabled={true}
            rowKey={'id'}
            dataSource={roles}
            tableColumnDefs={PAGE_TABLE_COL_DEFS}
            onCreate={this.onCreateRole}
            onSave={this.onSave}
            createFormControls={CREATE_FORM_CONTROLS}
            createText="新建角色"
            tableProps={{
              autoSizeColumnsToFit: false,
              onCellValueChanged: this.handleCellValueChanged,
            }}
            rowActions={this.getRowActions}
            actionColDef={{
              width: 150,
              pinned: 'right',
            }}
            removeable={true}
            onRemove={this.onRemove}
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
                角色：<span style={{ color: '#08c' }}>{choosedRole.roleName}</span> 数据权限列表
              </h2>
              <Button type="primary" onClick={this.hideResource}>
                返回角色列表
              </Button>
            </div>
            <ResourceManagement info={{ type: 'role', detail: choosedRole }} />
          </div>
        )}
      </PageHeaderWrapper>
    );
  }
}

export default SystemSettingsPermissions;
