import React from 'react';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { formatNumber } from '@/tools';

export const MarketSizeDefs = [
  {
    title: '日期',
    width: 140,
    dataIndex: 'statDate',
    onCell: () => ({ style: { color: 'rgba(222,230,240,1)' } }),
    render: value => {
      if (value) {
        return <span>{moment(value).format('YYYY-MM-DD')}</span>;
      }
      return <span>{value}</span>;
    },
  },
  {
    title: '实际成交名义金额',
    align: 'right',
    width: 200,
    dataIndex: 'trdNotionAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '成交笔数',
    width: 150,
    align: 'right',
    dataIndex: 'trdTransNum',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '期权费金额',
    align: 'right',
    width: 150,
    dataIndex: 'optFeeAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '成交客户数',
    align: 'right',
    width: 150,
    dataIndex: 'trdCusNum',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '实际持仓名义金额',
    width: 200,
    align: 'right',
    dataIndex: 'posNotionAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '持仓笔数',
    align: 'right',
    width: 150,
    dataIndex: 'posTransNum',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '持仓市值',
    align: 'right',
    width: 150,
    dataIndex: 'posValue',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '持仓客户数',
    align: 'right',
    width: 150,
    dataIndex: 'posCusNum',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '参与交易客户数',
    align: 'right',
    width: 180,
    dataIndex: 'inMarketCusNum',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '全市场客户数',
    align: 'right',
    width: 150,
    dataIndex: 'fullMarketCusNum',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
];

const DISTTYPE_OPTION = {
  CUS: '对手方持仓集中度',
  SUBCOMPANY: '子公司',
  VARIETY: '品种集中度',
};

export const MarketConcentrationDefs = [
  {
    title: '日期',
    width: 140,
    dataIndex: 'statDate',
    onCell: () => ({ style: { color: 'rgba(222,230,240,1)' } }),
    render: value => {
      if (value) {
        return <span>{moment(value).format('YYYY-MM-DD')}</span>;
      }
      return <span>{value}</span>;
    },
  },
  {
    title: '指标',
    width: 200,
    dataIndex: 'distType',
    render: value => <span>{value && DISTTYPE_OPTION[value]}</span>,
    onCell: () => ({ style: { color: 'rgba(222,230,240,1)' } }),
  },
  {
    title: '前三名实际持仓名义金额',
    align: 'right',
    width: 300,
    dataIndex: 'top3Pos',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '前三名集中度',
    align: 'right',
    width: 200,
    dataIndex: 'top3PosDist',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => (
      <span>{val && `${formatNumber(new BigNumber(val).multipliedBy(100).toNumber(), 2)}%`}</span>
    ),
  },
  {
    title: '前五名实际持仓名义金额',
    align: 'right',
    width: 300,
    dataIndex: 'top5Pos',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '前五名集中度',
    align: 'right',
    width: 200,
    dataIndex: 'top5PosDist',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => (
      <span>{val && `${formatNumber(new BigNumber(val).multipliedBy(100).toNumber(), 2)}%`}</span>
    ),
  },
  {
    title: '前十名实际持仓名义金额',
    align: 'right',
    width: 300,
    dataIndex: 'top10Pos',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '前十名集中度',
    align: 'right',
    width: 200,
    dataIndex: 'top10PosDist',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => (
      <span>{val && `${formatNumber(new BigNumber(val).multipliedBy(100).toNumber(), 2)}%`}</span>
    ),
  },
];
