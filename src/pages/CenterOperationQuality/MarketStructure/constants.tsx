import React from 'react';
import moment from 'moment';

export const KnockdownStructureDefs = [
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
    title: '开仓成交名义金额',
    width: 150,
    dataIndex: 'date33',
  },
  {
    title: '平仓成交名义金额',
    width: 150,
    dataIndex: 'date1',
  },
  {
    title: '终止成交名义金额',
    width: 150,
    dataIndex: 'date2',
  },
  {
    title: '成交名义金额',
    width: 150,
    dataIndex: 'date3',
  },
  {
    title: '开仓期权费金额',
    width: 150,
    dataIndex: 'date4',
  },
  {
    title: '平仓期权费金额',
    width: 150,
    dataIndex: 'date5',
  },
  {
    title: '平仓期权费金额',
    width: 150,
    dataIndex: 'date6',
  },
  {
    title: '期权费金额',
    width: 150,
    dataIndex: 'dat7e',
  },
  {
    title: '开仓成交客户数',
    width: 150,
    dataIndex: 'date8',
  },
  {
    title: '平仓成交客户数',
    width: 150,
    dataIndex: 'date9',
  },
  {
    title: '终止成交客户数',
    width: 150,
    dataIndex: 'date29',
  },
  {
    title: '成交客户数',
    width: 150,
    dataIndex: 'date39',
  },
];
export const PositionStructureDefs = [
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
    title: '买看涨持仓名义金额',
    width: 150,
    dataIndex: 'date33',
  },
  {
    title: '买看跌持仓名义金额',
    width: 150,
    dataIndex: 'date1',
  },
  {
    title: '买其他持仓名义金额',
    width: 150,
    dataIndex: 'date2',
  },
  {
    title: '买名义金额合计',
    width: 150,
    dataIndex: 'date3',
  },
  {
    title: '卖看涨持仓名义金额',
    width: 150,
    dataIndex: 'date4',
  },
  {
    title: '卖看跌持仓名义金额',
    width: 150,
    dataIndex: 'date5',
  },
  {
    title: '卖名义金额合计',
    width: 150,
    dataIndex: 'date6',
  },
  {
    title: '买看涨持仓市值',
    width: 150,
    dataIndex: 'dat7e',
  },
  {
    title: '买看跌持仓市值',
    width: 150,
    dataIndex: 'date8',
  },
  {
    title: '买其他持仓市值',
    width: 150,
    dataIndex: 'date19',
  },
  {
    title: '买市值合计',
    width: 150,
    dataIndex: 'date29',
  },
  {
    title: '卖看涨持仓市值',
    width: 150,
    dataIndex: 'date39',
  },
  {
    title: '卖看跌持仓市值',
    width: 150,
    dataIndex: 'date49',
  },
  {
    title: '卖市值合计',
    width: 150,
    dataIndex: 'date59',
  },
];
export const ToolStructureDefs = [
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
    title: '资产类型',
    width: 150,
    dataIndex: 'date33',
  },
  {
    title: '工具类型',
    width: 150,
    dataIndex: 'date1',
  },
  {
    title: '标的分类',
    width: 150,
    dataIndex: 'date2',
  },
  {
    title: '成交笔数',
    width: 150,
    dataIndex: 'date3',
  },
  {
    title: '成交名义金额',
    width: 150,
    dataIndex: 'date4',
  },
  {
    title: '持仓笔数',
    width: 150,
    dataIndex: 'date5',
  },
  {
    title: '持仓名义金额',
    width: 150,
    dataIndex: 'date6',
  },
  {
    title: '参与交易客户数',
    width: 150,
    dataIndex: 'dat7e',
  },
];
export const CustomerTypeStructureDefs = [
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
    title: '对手方类型',
    width: 150,
    dataIndex: 'date33',
  },
  {
    title: '资产类型',
    width: 150,
    dataIndex: 'date1',
  },
  {
    title: '成交笔数',
    width: 150,
    dataIndex: 'date2',
  },
  {
    title: '成交名义金额',
    width: 150,
    dataIndex: 'date3',
  },
  {
    title: '持仓笔数',
    width: 150,
    dataIndex: 'date4',
  },
  {
    title: '持仓名义金额',
    width: 150,
    dataIndex: 'date5',
  },
  {
    title: '参与交易客户数',
    width: 150,
    dataIndex: 'date6',
  },
];
