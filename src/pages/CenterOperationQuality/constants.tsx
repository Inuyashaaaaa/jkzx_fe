import React from 'react';
import moment from 'moment';

export const MarketSizeDefs = [
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
    title: '成交名义金额',
    width: 150,
    dataIndex: 'date33',
  },
  {
    title: '成交笔数',
    width: 150,
    dataIndex: 'date1',
  },
  {
    title: '期权费金额',
    width: 150,
    dataIndex: 'date2',
  },
  {
    title: '成交客户数',
    width: 150,
    dataIndex: 'date3',
  },
  {
    title: '持仓名义金额',
    width: 150,
    dataIndex: 'date4',
  },
  {
    title: '持仓笔数',
    width: 150,
    dataIndex: 'date5',
  },
  {
    title: '持仓市值',
    width: 150,
    dataIndex: 'date6',
  },
  {
    title: '持仓客户数',
    width: 150,
    dataIndex: 'dat7e',
  },
  {
    title: '参与交易客户数',
    width: 150,
    dataIndex: 'date8',
  },
  {
    title: '全市场客户数',
    width: 150,
    dataIndex: 'date9',
  },
];

export const MarketConcentrationDefs = [
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
    title: '指标',
    width: 150,
    dataIndex: 'date33',
  },
  {
    title: '前三名持仓名义金额',
    width: 150,
    dataIndex: 'date1',
  },
  {
    title: '前三名集中度',
    width: 150,
    dataIndex: 'date2',
  },
  {
    title: '前五名持仓名义金额',
    width: 150,
    dataIndex: 'date3',
  },
  {
    title: '前五名集中度',
    width: 150,
    dataIndex: 'date4',
  },
  {
    title: '前十名持仓名义金额',
    width: 150,
    dataIndex: 'date5',
  },
  {
    title: '前十名集中度',
    width: 150,
    dataIndex: 'date6',
  },
];
