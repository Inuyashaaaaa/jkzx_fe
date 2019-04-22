import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/design/components/Table/types';
import React from 'react';
import Operation from './Operation';

export const TABLE_COL_DEF: (fetchTable, showResource) => IColumnDef[] = (
  fetchTable,
  showResource
) => [
  {
    field: 'roleName',
    headerName: '角色',
    editable: true,
  },
  {
    field: 'alias',
    headerName: '别名',
    editable: true,
  },
  {
    field: 'remark',
    headerName: '备注',
    editable: true,
  },
  {
    headerName: '操作',
    render: params => {
      return <Operation data={params.data} fetchTable={fetchTable} showResource={showResource} />;
    },
  },
];

export const FORM_CONTROL: IFormControl[] = [
  {
    control: {
      label: '角色名',
    },
    field: 'roleName',
    input: {
      type: 'input',
    },
    decorator: {
      rules: [
        {
          required: true,
          message: '角色名必填',
        },
      ],
    },
  },
  {
    control: {
      label: '别名',
    },
    field: 'alias',
    input: {
      type: 'input',
    },
  },
  {
    control: {
      label: '备注信息',
    },
    field: 'remark',
    input: {
      type: 'textarea',
      autosize: { minRows: 4, maxRows: 4 },
    },
  },
];

export const treeData = [
  {
    title: '页面权限',
    key: 'default',
    children: [
      {
        title: '交易管理',
        key: 'tradeManagement',
        children: [
          {
            title: '交易录入',
            key: 'booking',
          },
          {
            title: '合约管理',
            key: 'contractManagement',
          },
          {
            title: '交易编辑',
            key: 'bookEdit',
          },
          {
            title: '行情管理',
            key: 'marketManagement',
          },
          {
            title: '标的物管理',
            key: 'subjectStore',
          },
          {
            title: '交易定价',
            key: 'pricing',
          },
          {
            title: '事件提醒',
            key: 'notifications',
          },
          {
            title: '场内交易管理',
            key: 'onBoardTransaction',
          },
          {
            title: '投资组合管理',
            key: 'portfolioManagement',
          },
          {
            title: '交易文档',
            key: 'tradeDocuments',
          },
        ],
      },
      {
        title: '定价管理',
        key: 'pricingSettings',
        children: [
          {
            title: '波动率曲面',
            key: 'volSurface',
          },
          {
            title: '无风险利率曲线',
            key: 'riskFreeCurve',
          },
          {
            title: '分红/融券曲线',
            key: 'dividendCurve',
          },
          {
            title: '基础合约管理',
            key: 'baseContractManagement',
          },
          {
            title: '定价设置',
            key: 'pricingEnvironment',
          },
        ],
      },
      {
        title: '客户管理',
        key: 'clientManagement',
        children: [
          {
            title: '客户信息管理',
            key: 'clientInfo',
          },
          {
            title: '销售管理',
            key: 'salesManagement',
          },
          {
            title: '银行账户管理',
            key: 'bankAccount',
          },
          {
            title: '客户资金统计',
            key: 'fundStatistics',
          },
          {
            title: '保证金管理',
            key: 'marginManagement',
          },
          {
            title: '台账管理',
            key: 'ioglodManagement',
          },
          {
            title: '财务出入金管理',
            key: 'discrepancyManagement',
          },
          {
            title: '客户估值报告',
            key: 'valuationManagement',
          },
        ],
      },

      //   {
      //     title: '审核',
      //     children: [
      //       {
      //         title: '审核配置',
      //         key: 'workflowSettings',
      //       },
      //       {
      //         title: '任务管理',
      //         key: 'processManagement',
      //       },
      //     ],
      //   },
      {
        title: '报告',
        key: 'reports',
        children: [
          {
            title: '标的物情景分析',
            key: 'spotLadder',
          },
          {
            title: '持仓明细',
            key: 'eodPosition',
          },
          {
            title: '汇总风险',
            key: 'eodRiskByUnderlyer',
          },
          {
            title: '汇总日盈亏',
            key: 'eodDailyPnlByUnderlyer',
          },
          {
            title: '历史盈亏',
            key: 'eodHistoricalPnlByUnderlyer',
          },
          {
            title: '交易报表',
            key: 'tradingStatements',
          },
          {
            title: '资金明细报表',
            key: 'fundsDetailedStatements',
          },
          {
            title: '客户资金汇总报表',
            key: 'customerFundsSummaryStatements',
          },
        ],
      },
      {
        title: '风险管理',
        key: 'riskManager',
        children: [
          {
            title: '持仓明细',
            key: 'intradayPositionReport',
          },
          {
            title: '标的风险',
            key: 'intradayRiskByUnderlyerReport',
          },
          {
            title: '标的盈亏',
            key: 'intradayDailyPnlByUnderlyerReport',
          },
          {
            title: '到期合约',
            key: 'intradayExpiringPositionReport',
          },
          {
            title: '定制化报告',
            key: 'customReport',
          },
          {
            title: '投资组合风险',
            key: 'portfolioRisk',
          },
        ],
      },
      {
        title: '审核管理',
        key: 'approvalProcess',
        children: [
          {
            title: '审批组管理',
            key: 'auditingManagement',
          },
          {
            title: '流程管理',
            key: 'approvalProcessManagement',
          },
          {
            title: '审批流程配置',
            key: 'processConfiguration',
          },
        ],
      },
      {
        title: '系统设置',
        key: 'systemSettings',
        children: [
          {
            title: '交易日历',
            key: 'calendars',
          },
          {
            title: '风控设置',
            key: 'riskSettings',
          },
          {
            title: '波动率管理日历',
            key: 'volatilityCalendar',
          },
          // {
          //   title: '角色管理',
          //   key: 'roles',
          // },
          {
            title: '角色管理',
            key: 'roleManagement',
          },
          {
            title: '用户管理',
            key: 'users',
          },
          {
            title: '部门管理',
            key: 'department',
          },
          {
            title: '资源管理',
            key: 'resources',
          },
          {
            title: '交易簿管理',
            key: 'tradeBooks',
          },
          {
            title: '文档模板管理',
            key: 'documentManagement',
          },
        ],
      },
    ],
  },
];
