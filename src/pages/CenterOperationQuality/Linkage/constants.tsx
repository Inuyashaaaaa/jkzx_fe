import React from 'react';
import moment from 'moment';
import { formatNumber } from '@/tools';

export const MarketDefs = [
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
    title: '品种',
    width: 200,
    dataIndex: 'commodityId',
    render: val => <span>{val}</span>,
  },
  {
    title: '子公司名称',
    width: 200,
    dataIndex: 'mainBodyName',
    render: val => <span>{val}</span>,
  },
  {
    title: '子公司场外持仓金额',
    align: 'right',
    width: 200,
    dataIndex: 'otcSubPosAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '子公司场内持仓金额',
    align: 'right',
    width: 200,
    dataIndex: 'etSubPosAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
];
export const VarietiesDefs = [
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
    title: '品种',
    width: 150,
    dataIndex: 'commodityId',
    render: val => <span>{val}</span>,
  },
  {
    title: '场外持仓名义金额',
    align: 'right',
    width: 200,
    dataIndex: 'otcPosAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '场外持仓比例',
    align: 'right',
    width: 150,
    dataIndex: 'otcPosRatio',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '场内持仓金额',
    align: 'right',
    width: 150,
    dataIndex: 'etPosAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '场内持仓比例',
    align: 'right',
    width: 150,
    dataIndex: 'etPosRatio',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '当月倍数（场外持仓比例/场内持仓比例）',
    align: 'right',
    width: 400,
    dataIndex: 'otcEtRatio',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
];
export const CounterpartyDefs = [
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
    title: '在场内开户的交易对手方个数',
    align: 'right',
    width: 300,
    dataIndex: 'etAccountCusNum',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val}</span>,
  },
  {
    title: '场内开户对手方场外持仓名义金额',
    align: 'right',
    width: 350,
    dataIndex: 'otcCusPosAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '交易对手方场内持仓金额',
    align: 'right',
    width: 250,
    dataIndex: 'etCusPosAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '对应账户的场内总权益',
    align: 'right',
    width: 250,
    dataIndex: 'etCusRight',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
];
