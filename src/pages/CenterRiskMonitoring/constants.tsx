import React from 'react';
import moment from 'moment';
import { formatNumber } from '@/tools';

export const InfectionRiskDefs = [
  {
    title: '日期',
    width: 250,
    dataIndex: 'statDate',
    render: value => {
      if (value) {
        return moment(value).format('YYYY-MM-DD hh:mm:ss');
      }
      return value;
    },
  },
  {
    title: '子公司间交易家数',
    align: 'right',
    width: 200,
    dataIndex: 'interCompNum',
  },
  {
    title: '子公司间成交金额',
    width: 200,
    align: 'right',
    dataIndex: 'interCompTrdAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '总成交金额',
    align: 'right',
    width: 200,
    dataIndex: 'compTrdAmountTotal',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '成交占比',
    align: 'right',
    width: 200,
    dataIndex: 'trdRatio',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '子公司间持仓金额',
    align: 'right',
    width: 200,
    dataIndex: 'interCompPosAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '总持仓金额',
    align: 'right',
    width: 200,
    dataIndex: 'compPosAmountTotal',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '持仓占比',
    align: 'right',
    width: 200,
    dataIndex: 'posRatio',
    render: val => val && formatNumber(val, 4),
  },
];

export const ControlRiskDefs = [
  {
    title: '日期',
    width: 250,
    dataIndex: 'statDate',
    render: value => {
      if (value) {
        return moment(value).format('YYYY-MM-DD hh:mm:ss');
      }
      return value;
    },
  },
  {
    title: '跨公司交易客户数',
    align: 'right',
    width: 150,
    dataIndex: 'interCompCusNum',
  },
  {
    title: '跨公司成交规模',
    align: 'right',
    width: 150,
    dataIndex: 'interCompTrd',
  },
  {
    title: '跨公司持仓规模',
    align: 'right',
    width: 150,
    dataIndex: 'interCompPos',
  },
];
