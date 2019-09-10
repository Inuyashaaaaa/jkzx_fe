import React from 'react';
import moment from 'moment';

export const MarketDefs = [
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
    title: '品种',
    width: 150,
    dataIndex: 'date33',
  },
  {
    title: '子公司名称',
    width: 150,
    dataIndex: 'date1',
  },
  {
    title: '子公司场外持仓金额',
    width: 150,
    dataIndex: 'date2',
  },
  {
    title: '子公司场内持仓金额',
    width: 150,
    dataIndex: 'date3',
  },
];
export const VarietiesDefs = [
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
    title: '品种',
    width: 150,
    dataIndex: 'date33',
  },
  {
    title: '场外持仓名义金额',
    width: 150,
    dataIndex: 'date1',
  },
  {
    title: '场外持仓比例',
    width: 150,
    dataIndex: 'date2',
  },
  {
    title: '场内持仓金额',
    width: 150,
    dataIndex: 'date3',
  },
  {
    title: '场内持仓比例',
    width: 150,
    dataIndex: 'date4',
  },
  {
    title: '当月倍数（场外持仓比例/场内持仓比例）',
    width: 150,
    dataIndex: 'date5',
  },
];
export const CounterpartyDefs = [
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
    title: '在场内开户的交易对手方个数',
    width: 150,
    dataIndex: 'date33',
  },
  {
    title: '场内开户对手方场外持仓名义金额',
    width: 150,
    dataIndex: 'date1',
  },
  {
    title: '交易对手方场内持仓金额',
    width: 150,
    dataIndex: 'date2',
  },
  {
    title: '对应账户的场内总权益',
    width: 150,
    dataIndex: 'date3',
  },
];
