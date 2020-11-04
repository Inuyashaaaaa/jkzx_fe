import mapTree from '../src/tools/mapTree';

export default [
  {
    path: '/socket-test-page',
    component: './SocketTestPage/index',
  },
  {
    path: '/component-test',
    component: './ComponentTest/index',
  },
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/userc/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  { path: '/welcome-page', redirect: '/bct/welcome-page' },
  {
    path: '/login/center',
    component: './login/center',
  },
  {
    path: '/jump-in',
    component: '../layouts/Jumping',
  },
  {
    path: '/component-test',
    component: './ComponentTest/index',
  },
  {
    path: '/',
    redirect: '/center/underlying',
  },
  mapTree(
    {
      path: '/center',
      centerRoute: true,
      name: 'center',
      component: './center/index',
      routes: [
        {
          path: '/center/welcome-page',
          name: 'welcome-page',
          component: './center/welcome-page',
          hideInMenu: true,
        },
        {
          path: '/center/overall-monitoring',
          component: './center/overall-monitoring',
          name: 'overall-monitoring',
          icon: 'line-chart',
        },
        {
          path: '/center/var-monitoring-and-analysis',
          component: './center/var-monitoring-and-analysis',
          name: 'var-monitoring-and-analysis',
          icon: 'line-chart',
          routes: [
            {
              path: '/center/var-monitoring-and-analysis/var-parameter-setting',
              component: './center/var-monitoring-and-analysis/var-parameter-setting',
              name: 'var-parameter-setting',
              icon: 'line-chart',
            },
            {
              path: '/center/var-monitoring-and-analysis/var-monitoring-report',
              component: './center/var-monitoring-and-analysis/var-monitoring-report',
              name: 'var-monitoring-report',
              icon: 'line-chart',
            },
            {
              path: '/center/var-monitoring-and-analysis/var-on-the-fly-testing',
              component: './center/var-monitoring-and-analysis/var-on-the-fly-testing',
              name: 'var-on-the-fly-testing',
              icon: 'line-chart',
            },
          ],
        },
        {
          path: '/center/market-monitoring',
          component: './center/market-monitoring',
          name: 'market-monitoring',
          icon: 'line-chart',
          routes: [
            {
              path: '/center/capital-monitoring',
              component: './center/market-monitoring/capital-monitoring',
              name: 'capital-monitoring',
              icon: 'line-chart',
            },
            {
              path: '/center/credit-monitoring',
              component: './center/market-monitoring/credit-monitoring',
              name: 'credit-monitoring',
              icon: 'line-chart',
            },
          ],
        },
        // {
        //   path: '/center/underlying',
        //   component: './CenterUnderlying',
        //   name: 'underlying',
        //   icon: 'line-chart',
        // },
        // {
        //   path: '/center/risk',
        //   component: './CenterRisk',
        //   name: 'risk',
        //   icon: 'reconciliation',
        // },
        // {
        //   path: '/center/scenario',
        //   component: './CenterScenario',
        //   name: 'scenario',
        //   icon: 'file-search',
        // },
        // {
        //   path: '/center/market',
        //   name: 'market',
        //   icon: 'pie-chart',
        //   routes: [
        //     {
        //       path: '/center/market/operation-quality',
        //       name: 'operation-quality',
        //       component: './CenterOperationQuality/index',
        //     },
        //     {
        //       path: '/center/market/risk-monitoring',
        //       name: 'risk-monitoring',
        //       component: './CenterRiskMonitoring/index',
        //     },
        //     {
        //       path: '/center/market/*',
        //       redirect: '/center/welcome-page',
        //     },
        //   ],
        // },
        {
          path: '/center/*',
          redirect: '/center/welcome-page',
        },
      ],
    },
    node => {
      if (!node.jumpAuthorized && !node.routes) {
        return { ...node, Routes: ['./src/pages/CenterAuthorized'] };
      }
      return node;
    },
    'routes',
  ),
  {
    path: '/api-docs',
    name: 'apiDocs',
    component: './ApiDocs/index',
  },
  mapTree(
    {
      appRoute: true,
      path: '/bct',
      component: '../layouts/BasicLayout',
      routes: [
        // {
        //   path: '/dashboard',
        //   name: 'dashboard',
        //   icon: 'dashboard',
        //   component: './Dashboard',
        // },
        {
          path: '/bct/welcome-page',
          name: 'welcomePage',
          component: './WelcomePage',
          hideInMenu: true,
        },
        {
          path: '/bct/trade-management',
          name: 'tradeManagement',
          icon: 'form',
          routes: [
            {
              path: '/bct/trade-management/booking',
              name: 'booking',
              component: './TradeManagementBooking/index',
            },
            {
              path: '/bct/trade-management/contract-manage',
              name: 'contractManagement',
              component: './TradeManagementContractManage/index',
            },
            {
              path: '/bct/trade-management/pricing',
              name: 'pricing',
              component: './TradeManagementPricing/index',
            },
            {
              path: '/bct/trade-management/notifications',
              name: 'notifications',
              component: './TradeManagementNotifications/index',
            },
            {
              path: '/bct/trade-management/market-management',
              name: 'marketManagement',
              component: './TradeManagementMarketManagement/index',
            },
            {
              path: '/bct/trade-management/subject-store',
              name: 'subjectStore',
              component: './TradeManagementSubjectStore/index',
              // hideInMenu: true,
            },
            {
              path: '/bct/trade-management/book-edit',
              name: 'bookEdit',
              component: './TradeManagementBookEdit/index',
              hideInMenu: true,
            },
            {
              path: '/bct/trade-management/on-board-transaction',
              name: 'onBoardTransaction',
              component: './TradeManagementOnBoardTransaction/index',
            },
            {
              path: '/bct/trade-management/portfolio-management',
              name: 'portfolioManagement',
              component: './TradeManagementPortfolioManagement/index',
            },
            {
              path: '/bct/trade-management/trade-documents',
              name: 'tradeDocuments',
              component: './TradeManagementTradeDocuments/index',
            },
            {
              path: '/bct/trade-management/*',
              redirect: '/center/welcome-page',
            },
          ],
        },
        {
          path: '/bct/pricingSettings',
          name: 'pricingSettings',
          icon: 'cluster',
          routes: [
            {
              path: '/bct/pricingSettings/volSurface',
              name: 'volSurface',
              component: './PricingSettingsVolSurface/index',
            },
            {
              path: '/bct/pricingSettings/risk-free-curve',
              name: 'riskFreeCurve',
              component: './PricingSettingsRiskFreeCurve/index',
            },
            {
              path: '/bct/pricingSettings/dividend-curve',
              name: 'dividendCurve',
              component: './PricingSettingsDividendCurve/index',
            },
            // {
            //   path: '/pricingSettings/base-contract-management',
            //   name: 'baseContractManagement',
            //   component: './PricingSettingsBaseContractManagement/index',
            // },
            // {
            //   path: '/pricingSettings/pricingEnvironment',
            //   name: 'pricingEnvironment',
            //   component: './PricingSettingsPricingEnvironment/index',
            // },
            {
              path: '/bct/pricingSettings/customModel',
              name: 'customModel',
              component: './PricingSettingCustomModal/index',
            },
            {
              path: '/bct/pricingSettings/*',
              redirect: '/center/welcome-page',
            },
          ],
        },
        {
          path: '/bct/client-management',
          name: 'clientManagement',
          icon: 'customer-service',
          routes: [
            {
              path: '/bct/client-management/client-info',
              name: 'clientInfo',
              component: './ClientManagementInfo/index',
            },
            {
              path: '/bct/client-management/sales-management',
              name: 'salesManagement',
              component: './ClientManagementSalesManagement/index',
            },
            {
              path: '/bct/client-management/bank-account',
              name: 'bankAccount',
              component: './ClientManagementBankAccount/index',
            },
            {
              path: '/bct/client-management/fund-statistics',
              name: 'fundStatistics',
              component: './ClientManagementFundStatistics/index',
            },
            {
              path: '/bct/client-management/margin-management',
              name: 'marginManagement',
              component: './ClientManagementMarginManagement/index',
            },
            {
              path: '/bct/client-management/ioglod-management',
              name: 'ioglodManagement',
              component: './ClientManagementIoglodManagement/index',
            },
            {
              path: '/bct/client-management/discrepancy-management',
              name: 'discrepancyManagement',
              component: './ClientManagementDiscrepancyManagement/index',
            },
            {
              path: '/bct/client-management/valuation-management',
              name: 'valuationManagement',
              component: './ClientManagementValuationManagement/index',
            },
            {
              path: '/bct/client-management/*',
              redirect: '/center/welcome-page',
            },
          ],
        },
        {
          path: '/bct/reports',
          name: 'reports',
          icon: 'table',
          routes: [
            {
              path: '/bct/reports/spotLadder',
              name: 'spotLadder',
              component: './ReportsSpotLadder/index',
            },
            {
              path: '/bct/reports/eod-position',
              name: 'eodPosition',
              component: './ReportsEodPosition/index',
            },
            {
              path: '/bct/reports/eod-risk-byUnderlyer',
              name: 'eodRiskByUnderlyer',
              component: './ReportsEodRiskByUnderlyer/index',
            },
            {
              path: '/bct/reports/eod-daily-pnl-byUnderlyer',
              name: 'eodDailyPnlByUnderlyer',
              component: './ReportsEodDailyPnlByUnderlyer/index',
            },
            {
              path: '/bct/reports/eod-historical-pnl-byUnderlyer',
              name: 'eodHistoricalPnlByUnderlyer',
              component: './ReportsEodHistoricalPnlByUnderlyer/index',
            },
            {
              path: '/bct/reports/trading-statements',
              name: 'tradingStatements',
              component: './ReportsTradingStatements/index',
            },
            {
              path: '/bct/reports/funds-detailed-statements',
              name: 'fundsDetailedStatements',
              component: './ReportsFundsDetailedStatements/index',
            },
            {
              path: '/bct/reports/customer-funds-summary-statements',
              name: 'customerFundsSummaryStatements',
              component: './ReportsCustomerFundsSummaryStatements/index',
            },
            {
              path: '/bct/reports/custom-management',
              name: 'reportsCustomManagement',
              component: './ReportsCustomManagement/index',
            },
            {
              path: '/bct/reports/*',
              redirect: '/center/welcome-page',
            },
          ],
        },
        {
          path: '/bct/risk-manager',
          name: 'riskManager',
          icon: 'safety-certificate',
          routes: [
            {
              path: '/bct/risk-manager/intraday-position-report',
              name: 'intradayPositionReport',
              component: './RiskManagerIntradayPositionReport/index',
            },
            {
              path: '/bct/risk-manager/intraday-risk-by-underlyer-report',
              name: 'intradayRiskByUnderlyerReport',
              component: './RiskManagerIntradayRiskByUnderlyerReport/index',
            },
            {
              path: '/bct/risk-manager/intraday-daily-pnl-by-underlyer-report',
              name: 'intradayDailyPnlByUnderlyerReport',
              component: './RiskManagerIntradayDailyPnlByUnderlyerReport/index',
            },
            {
              path: '/bct/risk-manager/intraday-expiring-position-report',
              name: 'intradayExpiringPositionReport',
              component: './RiskManagerIntradayExpiringPositionReport/index',
            },
            {
              path: '/bct/risk-manager/portfolio-risk',
              name: 'portfolioRisk',
              component: './RiskManagerPortfolioRisk/index',
            },
            {
              path: '/bct/risk-manager/*',
              redirect: '/center/welcome-page',
            },
          ],
        },
        {
          path: '/bct/approval-process',
          name: 'approvalProcess',
          icon: 'redo',
          routes: [
            {
              path: '/bct/approval-process/process-manangement',
              name: 'approvalProcessManagement',
              component: './ApprovalProcessManagement/index',
            },
            {
              path: '/bct/approval-process/auditing-management',
              name: 'auditingManagement',
              component: './ApprovalProcessAuditingManagement/index',
            },
            {
              path: '/bct/approval-process/process-configuration',
              name: 'processConfiguration',
              component: './ApprovalProcessConfiguration/index',
            },
            {
              path: '/bct/approval-process/*',
              redirect: '/center/welcome-page',
            },
          ],
        },
        {
          path: '/bct/system-settings',
          name: 'systemSettings',
          icon: 'tool',
          routes: [
            {
              path: '/bct/system-settings/users',
              name: 'users',
              component: './SystemSettingsUsers/index',
            },
            // {
            //   path: '/system-settings/roles',
            //   name: 'roles',
            //   component: './SystemSettingsRoles/index',
            // },
            {
              path: '/bct/system-settings/role-management',
              name: 'roleManagement',
              component: './SystemSettingsRoleManagement/index',
            },
            {
              path: '/bct/system-settings/department',
              name: 'department',
              component: './SystemSettingDepartment/index',
            },
            {
              path: '/bct/system-settings/resources',
              name: 'resources',
              component: './SystemSettingResource/index',
            },
            {
              path: '/bct/system-settings/tradeBooks',
              name: 'tradeBooks',
              component: './SystemSettingsTradeBooks/index',
            },
            {
              path: '/bct/system-settings/volatilityCalendar',
              name: 'volatilityCalendar',
              component: './SystemSettingsVolatilityCalendar/index',
            },
            {
              path: '/bct/system-settings/calendars',
              name: 'calendars',
              component: './SystemSettingsCalendars/index',
            },
            {
              path: '/bct/system-settings/riskSettings',
              name: 'riskSettings',
              component: './SystemSettingsRiskSettings/index',
            },
            {
              path: '/bct/system-settings/document-management',
              name: 'documentManagement',
              component: './SystemSettingsDocumentManagement/index',
            },
            {
              path: '/bct/system-settings/operation-log',
              name: 'operationLog',
              component: './SystemSettingOperationLog/index',
            },
            {
              path: '/bct/system-settings/*',
              redirect: '/center/welcome-page',
            },
          ],
        },
        {
          path: '/bct/*',
          redirect: '/center/welcome-page',
        },
      ],
    },
    node => {
      if (!node.routes) {
        return { ...node, Routes: ['./src/pages/Authorized'] };
      }
      return node;
    },
    'routes',
  ),
  {
    path: '*',
    redirect: '/center/welcome-page',
  },
  {
    component: '404',
  },
];
