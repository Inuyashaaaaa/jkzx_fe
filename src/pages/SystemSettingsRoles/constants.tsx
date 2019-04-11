import { IFormControl } from '@/lib/components/_Form2';
import { IColumnDef } from '@/lib/components/_Table2';
import { Icon } from 'antd';
import React from 'react';

export const PAGE_TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '基本信息',
    children: [
      {
        headerName: '角色',
        field: 'roleName',
        width: 100,
        pinned: 'left',
        editable: true,
      },
      {
        headerName: '别名',
        field: 'alias',
        width: 100,
        pinned: 'left',
        editable: true,
      },
      {
        headerName: '备注',
        field: 'remark',
        width: 150,
        pinned: 'left',
        editable: true,
      },
    ],
  },
  {
    headerName: '页面权限',
    children: [
      {
        headerName: '交易管理',
        children: [
          {
            headerName: '交易录入',
            field: 'booking',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '合约管理',
            field: 'contractManagement',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '交易编辑',
            field: 'bookEdit',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '行情管理',
            field: 'marketManagement',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '标的物管理',
            field: 'subjectStore',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '交易定价',
            field: 'pricing',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '事件提醒',
            field: 'notifications',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '场内交易管理',
            field: 'onBoardTransaction',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '投资组合管理',
            field: 'portfolioManagement',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '交易文档',
            field: 'tradeDocuments',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
        ],
      },
      {
        headerName: '定价管理',
        children: [
          {
            headerName: '波动率曲面',
            field: 'volSurface',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '无风险利率曲线',
            field: 'riskFreeCurve',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '分红/融券曲线',
            field: 'dividendCurve',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '基础合约管理',
            field: 'baseContractManagement',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '定价设置',
            field: 'pricingEnvironment',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
        ],
      },
      {
        headerName: '客户管理',
        children: [
          {
            headerName: '客户信息管理',
            field: 'clientInfo',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
        ],
      },
      {
        headerName: '销售管理',
        field: 'customSalesManage',
        editable: true,
        input: {
          type: 'checkbox',
          formatValue(value) {
            if (value) {
              return <Icon type="check" />;
            }
            return <Icon type="close" />;
          },
        },
        width: 150,
      },
      {
        headerName: '客户银行账户管理',
        field: 'bankAccount',
        editable: true,
        input: {
          type: 'checkbox',
          formatValue(value) {
            if (value) {
              return <Icon type="check" />;
            }
            return <Icon type="close" />;
          },
        },
        width: 150,
      },
      {
        headerName: '审核',
        children: [
          {
            headerName: '审核配置',
            field: 'workflowSettings',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '任务管理',
            field: 'processManagement',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
        ],
      },
      {
        headerName: '报告',
        children: [
          {
            headerName: '标的物情景分析',
            field: 'spotLadder',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '持仓明细',
            field: 'eodPosition',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '汇总风险',
            field: 'intradayRiskByUnderlyerReport',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '汇总日盈亏',
            field: 'eodDailyPnlByUnderlyer',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '历史盈亏',
            field: 'eodHistoricalPnlByUnderlyer',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '交易报表',
            field: 'tradingStatements',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '资金明细报表',
            field: 'fundsDetailedStatements',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '客户资金汇总报表',
            field: 'customerFundsSummaryStatements',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
        ],
      },
      {
        headerName: '风险管理',
        children: [
          {
            headerName: '持仓明细',
            field: 'intradayPositionReport',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '标的风险',
            field: 'intradayRiskByUnderlyerReport',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '标的盈亏',
            field: 'intradayDailyPnlByUnderlyerReport',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '到期合约',
            field: 'intradayExpiringPositionReport',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '定制化报告',
            field: 'customReport',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '投资组合风险',
            field: 'portfolioRisk',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
        ],
      },
      {
        headerName: '审核管理',
        children: [
          {
            headerName: '流程管理',
            field: 'approvalProcessManagement',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '审批组管理',
            field: 'approvalAuditingManagement',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
        ],
      },
      {
        headerName: '系统设置',
        children: [
          {
            headerName: '交易日历',
            field: 'calendars',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '风控设置',
            field: 'riskSettings',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '波动率管理日历',
            field: 'volatilityCalendar',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '权限设置',
            field: 'permissions',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '角色管理',
            field: 'roles',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '用户管理',
            field: 'users',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '部门管理',
            field: 'department',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '资源管理',
            field: 'resources',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '交易簿管理',
            field: 'tradeBooks',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
          {
            headerName: '文档模板管理',
            field: 'documentManagement',
            editable: true,
            input: {
              type: 'checkbox',
              formatValue(value) {
                if (value) {
                  return <Icon type="check" />;
                }
                return <Icon type="close" />;
              },
            },
            width: 150,
          },
        ],
      },
    ],
  },
];

export const CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    dataIndex: 'roleName',
    control: {
      label: '角色名',
    },
    input: {
      type: 'input',
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    dataIndex: 'alias',
    control: {
      label: '别名',
    },
    input: {
      type: 'input',
    },
  },
  {
    dataIndex: 'remark',
    control: {
      label: '备注信息',
    },
    input: {
      type: 'textarea',
    },
  },
];
