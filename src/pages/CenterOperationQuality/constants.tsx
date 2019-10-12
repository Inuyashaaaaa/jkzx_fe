import React from 'react';
import moment from 'moment';
import { formatNumber } from '@/tools';

export const MarketSizeDefs = [
  {
    title: '日期',
    width: 200,
    dataIndex: 'statDate',
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
    dataIndex: 'trdNotionAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '成交笔数',
    width: 150,
    dataIndex: 'trdTransNum',
  },
  {
    title: '期权费金额',
    width: 150,
    dataIndex: 'optFeeAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '成交客户数',
    width: 150,
    dataIndex: 'trdCusNum',
  },
  {
    title: '持仓名义金额',
    width: 150,
    dataIndex: 'posNotionAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '持仓笔数',
    width: 150,
    dataIndex: 'posTransNum',
  },
  {
    title: '持仓市值',
    width: 150,
    dataIndex: 'posValue',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '持仓客户数',
    width: 150,
    dataIndex: 'posCusNum',
  },
  {
    title: '参与交易客户数',
    width: 150,
    dataIndex: 'inMarketCusNum',
  },
  {
    title: '全市场客户数',
    width: 150,
    dataIndex: 'fullMarketCusNum',
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
    width: 200,
    dataIndex: 'statDate',
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
    dataIndex: 'distType',
    render: value => value && DISTTYPE_OPTION[value],
  },
  {
    title: '前三名持仓名义金额',
    width: 150,
    dataIndex: 'top3Pos',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '前三名集中度',
    width: 150,
    dataIndex: 'top3PosDist',
  },
  {
    title: '前五名持仓名义金额',
    width: 150,
    dataIndex: 'top5Pos',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '前五名集中度',
    width: 150,
    dataIndex: 'top5PosDist',
  },
  {
    title: '前十名持仓名义金额',
    width: 150,
    dataIndex: 'top10Pos',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '前十名集中度',
    width: 150,
    dataIndex: 'top10PosDist',
  },
];
