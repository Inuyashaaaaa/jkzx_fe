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
  // center login
  {
    path: '/center/login',
    component: '../layouts/Center/Login',
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
  {
    path: '/center',
    centerRoute: true,
    component: '../layouts/Center/index',
    routes: [
      {
        path: '/center/underlying',
        component: './CenterUnderlying',
      },
      {
        path: '/center/risk',
        component: './CenterRisk',
      },
      {
        path: '/center/scenario',
        component: './CenterScenario',
      },
      {
        path: '/center/operation-quality',
        name: 'centerOperationQuality',
        component: './CenterOperationQuality',
      },
      {
        path: '/center/risk-monitoring',
        name: 'centerRiskMonitoring',
        component: './CenterRiskMonitoring',
      },
    ],
  },
  // {
  //   path: '/center-login',
  //   component: '/user/login',
  // },
  mapTree(
    {
      appRoute: true,
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        // {
        //   path: '/dashboard',
        //   name: 'dashboard',
        //   icon: 'dashboard',
        //   component: './Dashboard',
        // },
        {
          path: '/welcome-page',
          name: 'welcomePage',
          component: './WelcomePage',
          hideInMenu: true,
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
              path: '/trade-management/contract-manage',
              name: 'contractManagement',
              component: './TradeManagementContractManage/index',
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
              // hideInMenu: true,
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
              path: '/pricingSettings/customModel',
              name: 'customModel',
              component: './PricingSettingCustomModal/index',
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
            {
              path: '/client-management/sales-management',
              name: 'salesManagement',
              component: './ClientManagementSalesManagement/index',
            },
            {
              path: '/client-management/bank-account',
              name: 'bankAccount',
              component: './ClientManagementBankAccount/index',
            },
            {
              path: '/client-management/fund-statistics',
              name: 'fundStatistics',
              component: './ClientManagementFundStatistics/index',
            },
            {
              path: '/client-management/margin-management',
              name: 'marginManagement',
              component: './ClientManagementMarginManagement/index',
            },
            {
              path: '/client-management/ioglod-management',
              name: 'ioglodManagement',
              component: './ClientManagementIoglodManagement/index',
            },
            {
              path: '/client-management/discrepancy-management',
              name: 'discrepancyManagement',
              component: './ClientManagementDiscrepancyManagement/index',
            },
            {
              path: '/client-management/valuation-management',
              name: 'valuationManagement',
              component: './ClientManagementValuationManagement/index',
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
            {
              path: '/reports/custom-management',
              name: 'reportsCustomManagement',
              component: './ReportsCustomManagement/index',
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
              path: '/risk-manager/intraday-expiring-position-report',
              name: 'intradayExpiringPositionReport',
              component: './RiskManagerIntradayExpiringPositionReport/index',
            },
            {
              path: '/risk-manager/portfolio-risk',
              name: 'portfolioRisk',
              component: './RiskManagerPortfolioRisk/index',
            },
          ],
        },
        {
          path: '/approval-process',
          name: 'approvalProcess',
          icon: 'redo',
          routes: [
            {
              path: '/approval-process/process-manangement',
              name: 'approvalProcessManagement',
              component: './ApprovalProcessManagement/index',
            },
            {
              path: '/approval-process/auditing-management',
              name: 'auditingManagement',
              component: './ApprovalProcessAuditingManagement/index',
            },
            {
              path: '/approval-process/process-configuration',
              name: 'processConfiguration',
              component: './ApprovalProcessConfiguration/index',
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
            {
              path: '/system-settings/operation-log',
              // name: 'documentManagement',
              name: 'operationLog',
              component: './SystemSettingOperationLog/index',
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
    'routes',
  ),
  {
    component: '404',
  },
];
