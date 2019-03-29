import mapTree from '../src/lib/utils/mapTree';

export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    path: '/test',
    component: '../layouts/TestLayout',
  },
  mapTree(
    {
      appRoute: true,
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        {
          path: '/dashboard',
          name: 'dashboard',
          icon: 'dashboard',
          component: './Dashboard',
        },
        {
          path: '/trade-management',
          name: 'tradeManagement',
          icon: 'form',
          routes: [
            {
              path: '/trade-management/booking',
              name: 'booking',
              component: './TradeManagementBooking/index',
            },
            {
              path: '/trade-management/contract-management',
              name: 'contractManagement',
              component: './TradeManagementContractManagement/index',
            },
            {
              path: '/trade-management/pricing',
              name: 'pricing',
              component: './TradeManagementPricing/index',
            },
            {
              path: '/trade-management/notifications',
              name: 'notifications',
              component: './TradeManagementNotifications/index',
            },
            {
              path: '/trade-management/market-management',
              name: 'marketManagement',
              component: './TradeManagementMarketManagement/index',
            },
            {
              path: '/trade-management/subject-store',
              name: 'subjectStore',
              component: './TradeManagementSubjectStore/index',
              hideInMenu: true,
            },
            {
              path: '/trade-management/book-edit',
              name: 'bookEdit',
              component: './TradeManagementBookEdit/index',
              hideInMenu: true,
            },
            {
              path: '/trade-management/on-board-transaction',
              name: 'onBoardTransaction',
              component: './TradeManagementOnBoardTransaction/index',
            },
            {
              path: '/trade-management/portfolio-management',
              name: 'portfolioManagement',
              component: './TradeManagementPortfolioManagement/index',
            },
            {
              path: '/trade-management/trade-documents',
              name: 'tradeDocuments',
              component: './TradeManagementTradeDocuments/index',
            },
          ],
        },
        {
          path: '/pricingSettings',
          name: 'pricingSettings',
          icon: 'cluster',

          routes: [
            {
              path: '/pricingSettings/volSurface',
              name: 'volSurface',
              component: './PricingSettingsVolSurface/index',
            },
            {
              path: '/pricingSettings/risk-free-curve',
              name: 'riskFreeCurve',
              component: './PricingSettingsRiskFreeCurve/index',
            },
            {
              path: '/pricingSettings/dividend-curve',
              name: 'dividendCurve',
              component: './PricingSettingsDividendCurve/index',
            },
            {
              path: '/pricingSettings/base-contract-management',
              name: 'baseContractManagement',
              component: './PricingSettingsBaseContractManagement/index',
            },
            {
              path: '/pricingSettings/pricingEnvironment',
              name: 'pricingEnvironment',
              component: './PricingSettingsPricingEnvironment/index',
            },
          ],
        },
        {
          path: '/client-management',
          name: 'clientManagement',
          icon: 'customer-service',
          routes: [
            {
              path: '/client-management/client-info',
              name: 'clientInfo',
              component: './ClientManagementInfo/index',
            },
          ],
        },
        {
          path: '/customer-sales-manage',
          name: 'customSalesManage',
          component: './CustomSalesManage/index',
          hideInMenu: true,
        },
        {
          path: '/customer-valuation',
          name: 'customValuation',
          component: './CustomValuation/index',
          hideInMenu: true,
        },
        {
          path: '/customer-info',
          name: 'customInfo',
          component: './CustomInfo/index',

          hideInMenu: true,
        },
        {
          path: '/bank-account',
          name: 'bankAccount',
          component: './BankAccount/index',
          hideInMenu: true,
        },
        {
          path: '/workflow-management',
          name: 'workflowManagement',
          icon: 'safety',
          hideInMenu: true,
          routes: [
            {
              path: '/workflow-management/workflow-settings',
              name: 'workflowSettings',
              component: './WorkflowManagementWorkflowSettings/index',
            },
            {
              path: '/workflow-management/process-management',
              name: 'processManagement',
              component: './WorkflowManagementProcessManagement/index',
            },
          ],
        },
        {
          path: '/reports',
          name: 'reports',
          icon: 'table',

          routes: [
            {
              path: '/reports/spotLadder',
              name: 'spotLadder',
              component: './ReportsSpotLadder/index',
            },
            {
              path: '/reports/eod-position',
              name: 'eodPosition',
              component: './ReportsEodPosition/index',
            },
            {
              path: '/reports/eod-risk-byUnderlyer',
              name: 'eodRiskByUnderlyer',
              component: './ReportsEodRiskByUnderlyer/index',
            },
            {
              path: '/reports/eod-daily-pnl-byUnderlyer',
              name: 'eodDailyPnlByUnderlyer',
              component: './ReportsEodDailyPnlByUnderlyer/index',
            },
            {
              path: '/reports/eod-historical-pnl-byUnderlyer',
              name: 'eodHistoricalPnlByUnderlyer',
              component: './ReportsEodHistoricalPnlByUnderlyer/index',
            },
            {
              path: '/reports/trading-statements',
              name: 'tradingStatements',
              component: './ReportsTradingStatements/index',
            },
            {
              path: '/reports/funds-detailed-statements',
              name: 'fundsDetailedStatements',
              component: './ReportsFundsDetailedStatements/index',
            },
            {
              path: '/reports/customer-funds-summary-statements',
              name: 'customerFundsSummaryStatements',
              component: './ReportsCustomerFundsSummaryStatements/index',
            },
          ],
        },
        {
          path: '/risk-manager',
          name: 'riskManager',
          icon: 'safety-certificate',
          routes: [
            {
              path: '/risk-manager/intraday-position-report',
              name: 'intradayPositionReport',
              component: './RiskManagerIntradayPositionReport/index',
            },
            {
              path: '/risk-manager/intraday-risk-by-underlyer-report',
              name: 'intradayRiskByUnderlyerReport',
              component: './RiskManagerIntradayRiskByUnderlyerReport/index',
            },
            {
              path: '/risk-manager/intraday-daily-pnl-by-underlyer-report',
              name: 'intradayDailyPnlByUnderlyerReport',
              component: './RiskManagerIntradayDailyPnlByUnderlyerReport/index',
            },
            {
              path: '/risk-manager/custom-report',
              name: 'customReport',
              component: './RiskManagerCustomReport/index',
            },
            {
              path: '/risk-manager/intraday-expiring-position-report',
              name: 'intradayExpiringPositionReport',
              component: './RiskManagerIntradayExpiringPositionReport/index',
            },
          ],
        },
        {
          path: '/approval-process',
          name: 'approvalProcess',
          icon: 'interation',
          routes: [
            {
              path: '/approval-process/process-manangement',
              name: 'approvalProcessManagement',
              component: './ApprovalProcessManagement/index',
            },
          ],
        },
        {
          path: '/system-settings',
          name: 'systemSettings',
          icon: 'tool',
          routes: [
            {
              path: '/system-settings/users',
              name: 'users',
              component: './SystemSettingsUsers/index',
            },
            // {
            //   path: '/system-settings/roles',
            //   name: 'roles',
            //   component: './SystemSettingsRoles/index',
            // },
            {
              path: '/system-settings/role-management',
              name: 'roleManagement',
              component: './SystemSettingsRoleManagement/index',
            },
            {
              path: '/system-settings/department',
              name: 'department',
              component: './SystemSettingDepartment/index',
            },
            {
              path: '/system-settings/resources',
              name: 'resources',
              component: './SystemSettingResource/index',
            },
            {
              path: '/system-settings/tradeBooks',
              name: 'tradeBooks',
              component: './SystemSettingsTradeBooks/index',
            },
            {
              path: '/system-settings/volatilityCalendar',
              name: 'volatilityCalendar',
              component: './SystemSettingsVolatilityCalendar/index',
            },
            {
              path: '/system-settings/calendars',
              name: 'calendars',
              component: './SystemSettingsCalendars/index',
            },
            {
              path: '/system-settings/riskSettings',
              name: 'riskSettings',
              component: './SystemSettingsRiskSettings/index',
            },
            {
              path: '/system-settings/document-management',
              name: 'documentManagement',
              component: './SystemSettingsDocumentManagement/index',
            },
          ],
        },
      ],
    },
    node => {
      if (!node.routes) {
        return { ...node, Routes: ['./src/pages/Authorized'] };
      }
      return node;
    },
    'routes'
  ),
  {
    component: '404',
  },
];
