import React from 'react';
import moment from 'moment';

export const InfectionRiskDefs = [
  {
    title: '日期',
    width: 150,
    dataIndex: 'date',
    render: value => {
      if (value) {
        return moment(value).format('YYYY-MM-DD hh-mm-ss');
      }
      return value;
    },
  },
  {
    title: '子公司间交易家数',
    width: 150,
    dataIndex: 'date33',
  },
  {
    title: '子公司间成交金额',
    width: 150,
    dataIndex: 'date1',
  },
  {
    title: '总成交金额',
    width: 150,
    dataIndex: 'date2',
  },
  {
    title: '成交占比',
    width: 150,
    dataIndex: 'date3',
  },
  {
    title: '子公司间持仓金额',
    width: 150,
    dataIndex: 'date4',
  },
  {
    title: '总持仓金额',
    width: 150,
    dataIndex: 'date5',
  },
  {
    title: '持仓占比',
    width: 150,
    dataIndex: 'date6',
  },
];

export const ControlRiskDefs = [
  {
    title: '日期',
    width: 150,
    dataIndex: 'date',
    render: value => {
      if (value) {
        return moment(value).format('YYYY-MM-DD hh-mm-ss');
      }
      return value;
    },
  },
  {
    title: '跨公司交易客户数',
    width: 150,
    dataIndex: 'date33',
  },
  {
    title: '跨公司成交规模',
    width: 150,
    dataIndex: 'date1',
  },
  {
    title: '跨公司持仓规模',
    width: 150,
    dataIndex: 'date2',
  },
];
