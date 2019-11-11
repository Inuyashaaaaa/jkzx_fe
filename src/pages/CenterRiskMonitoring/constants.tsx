import React from 'react';
import moment from 'moment';
import { formatNumber } from '@/tools';

export const InfectionRiskDefs = [
  {
    title: '日期',
    width: 140,
    dataIndex: 'statDate',
    render: value => {
      if (value) {
        return <span>{moment(value).format('YYYY-MM-DD')}</span>;
      }
      return <span>{value}</span>;
    },
  },
  {
    title: '子公司间交易家数',
    align: 'right',
    width: 200,
    dataIndex: 'interCompNum',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val}</span>,
  },
  {
    title: '子公司间成交金额',
    width: 200,
    align: 'right',
    dataIndex: 'interCompTrdAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '总成交金额',
    align: 'right',
    width: 200,
    dataIndex: 'compTrdAmountTotal',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '成交占比',
    align: 'right',
    width: 200,
    dataIndex: 'trdRatio',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '子公司间持仓金额',
    align: 'right',
    width: 200,
    dataIndex: 'interCompPosAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '总持仓金额',
    align: 'right',
    width: 200,
    dataIndex: 'compPosAmountTotal',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '持仓占比',
    align: 'right',
    width: 200,
    dataIndex: 'posRatio',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
];

export const ControlRiskDefs = [
  {
    title: '日期',
    width: 140,
    dataIndex: 'statDate',
    render: value => {
      if (value) {
        return <span>{moment(value).format('YYYY-MM-DD')}</span>;
      }
      return <span>{value}</span>;
    },
  },
  {
    title: '跨公司交易客户数',
    align: 'right',
    width: 150,
    dataIndex: 'interCompCusNum',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val}</span>,
  },
  {
    title: '跨公司成交规模',
    align: 'right',
    width: 150,
    dataIndex: 'interCompTrd',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val}</span>,
  },
  {
    title: '跨公司持仓规模',
    align: 'right',
    width: 150,
    dataIndex: 'interCompPos',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val}</span>,
  },
];
