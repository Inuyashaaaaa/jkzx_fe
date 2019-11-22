import React from 'react';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { formatNumber } from '@/tools';

export const InfectionRiskDefs = [
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
    title: '子公司间交易家数',
    align: 'right',
    width: 200,
    dataIndex: 'interCompNum',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '子公司间成交金额',
    width: 200,
    align: 'right',
    dataIndex: 'interCompTrdAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '总成交金额',
    align: 'right',
    width: 200,
    dataIndex: 'compTrdAmountTotal',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '成交占比',
    align: 'right',
    width: 200,
    dataIndex: 'trdRatio',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '子公司间持仓金额',
    align: 'right',
    width: 200,
    dataIndex: 'interCompPosAmount',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '总持仓金额',
    align: 'right',
    width: 200,
    dataIndex: 'compPosAmountTotal',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '持仓占比',
    align: 'right',
    width: 200,
    dataIndex: 'posRatio',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
];

export const ControlRiskDefs = [
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
    title: '跨公司交易客户数',
    align: 'right',
    width: 150,
    dataIndex: 'interCompCusNum',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '跨公司成交规模',
    align: 'right',
    width: 150,
    dataIndex: 'interCompTrd',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '跨公司持仓规模',
    align: 'right',
    width: 150,
    dataIndex: 'interCompPos',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
];

export const PositionProportionDefs = [
  {
    title: '日期',
    width: 140,
    dataIndex: 'statDate',
    fixed: 'left',
    onCell: () => ({ style: { color: 'rgba(222,230,240,1)' } }),
    render: value => {
      if (value) {
        return <span>{moment(value).format('YYYY-MM-DD')}</span>;
      }
      return <span>{value}</span>;
    },
  },
  {
    title: '对手方名称',
    width: 420,
    fixed: 'left',
    dataIndex: 'analogueName',
    render: val => <span>{val}</span>,
    onCell: () => ({ style: { color: 'rgba(222,230,240,1)' } }),
  },
  {
    title: '标的资产品种',
    width: 200,
    dataIndex: 'underAssVarit',
    fixed: 'left',
    render: val => <span>{val}</span>,
    onCell: () => ({ style: { color: 'rgba(222,230,240,1)' } }),
  },
  {
    title: '在所有子公司的正Delta累加值',
    align: 'right',
    width: 200,
    dataIndex: 'cusPositiveDelta',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '场内空头持仓量',
    align: 'right',
    width: 200,
    dataIndex: 'cusShortPosition',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '在所有子公司的负Delta累加值',
    align: 'right',
    width: 200,
    dataIndex: 'cusNegativeDelta',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '场内多头持仓量',
    align: 'right',
    width: 200,
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    dataIndex: 'cusLongPosition',
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '场内合并单边最大持仓',
    align: 'right',
    width: 200,
    dataIndex: 'exchangeMaxPos',
    render: val => <span>{val && formatNumber(val, 0)}</span>,
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
  {
    title: '场内单边持仓量',
    align: 'right',
    width: 200,
    dataIndex: 'exchangePos',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val && formatNumber(val, 0)}</span>,
  },
  {
    title: '对手方场内外合并持仓占比',
    align: 'right',
    width: 200,
    dataIndex: 'cusExgOtcRatio',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => (
      <span>{val && `${formatNumber(new BigNumber(val).multipliedBy(100).toNumber(), 2)}%`}</span>
    ),
  },
];
