import React from 'react';
import moment from 'moment';
import { formatNumber } from '@/tools';

export const KnockdownStructureDefs = [
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
    title: '开仓成交名义金额',
    width: 150,
    dataIndex: 'openTrdNotionAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '平仓成交名义金额',
    width: 150,
    dataIndex: 'closeTrdNotionAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '终止成交名义金额',
    width: 150,
    dataIndex: 'endTrdNotionAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '成交名义金额',
    width: 150,
    dataIndex: 'trdNotionAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '开仓期权费金额',
    width: 150,
    dataIndex: 'trdOpenPremium',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '平仓期权费金额',
    width: 150,
    dataIndex: 'trdClosePremium',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '终止期权费金额',
    width: 150,
    dataIndex: 'trdEndPremium',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '期权费金额',
    width: 150,
    dataIndex: 'premiumAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '开仓成交客户数',
    width: 150,
    dataIndex: 'trdOpenCusNum',
  },
  {
    title: '平仓成交客户数',
    width: 150,
    dataIndex: 'trdCloseCusNum',
  },
  {
    title: '终止成交客户数',
    width: 150,
    dataIndex: 'trdEndCusNum',
  },
  {
    title: '成交客户数',
    width: 150,
    dataIndex: 'trdCusNum',
  },
];
export const PositionStructureDefs = [
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
    title: '买看涨持仓名义金额',
    width: 150,
    dataIndex: 'posCallBuyAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '买看跌持仓名义金额',
    width: 150,
    dataIndex: 'posPutBuyAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '买其他持仓名义金额',
    width: 150,
    dataIndex: 'posOtherBuyAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '买名义金额合计',
    width: 150,
    dataIndex: 'posBuyAmountTotal',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '卖看涨持仓名义金额',
    width: 150,
    dataIndex: 'posCallSellAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '卖看跌持仓名义金额',
    width: 150,
    dataIndex: 'posPutSellAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '卖名义金额合计',
    width: 150,
    dataIndex: 'posSellAmountTotal',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '买看涨持仓市值',
    width: 150,
    dataIndex: 'posCallBuyCValue',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '买看跌持仓市值',
    width: 150,
    dataIndex: 'posPutBuyCValue',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '买其他持仓市值',
    width: 150,
    dataIndex: 'posOtherBuyCValue',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '买市值合计',
    width: 150,
    dataIndex: 'posBuyValueTotal',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '卖看涨持仓市值',
    width: 150,
    dataIndex: 'posCallSellCValue',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '卖看跌持仓市值',
    width: 150,
    dataIndex: 'posPutSellCValue',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '卖市值合计',
    width: 150,
    dataIndex: 'posSellValueTotal',
    render: val => val && formatNumber(val, 4),
  },
];

export const ToolStructureDefs = [
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
    title: '资产类型',
    width: 150,
    dataIndex: 'assetType',
  },
  {
    title: '工具类型',
    width: 150,
    dataIndex: 'toolType',
  },
  {
    title: '标的分类',
    width: 150,
    dataIndex: 'date2',
  },
  {
    title: '成交笔数',
    width: 150,
    dataIndex: 'trdTransNum',
  },
  {
    title: '成交名义金额',
    width: 150,
    dataIndex: 'trdNotionAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '持仓笔数',
    width: 150,
    dataIndex: 'posTransNum',
  },
  {
    title: '持仓名义金额',
    width: 150,
    dataIndex: 'posNotionAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '参与交易客户数',
    width: 150,
    dataIndex: 'inMarketCusNum',
  },
];
export const CustomerTypeStructureDefs = [
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
    title: '对手方类型',
    width: 150,
    dataIndex: 'cusType',
  },
  {
    title: '资产类型',
    width: 150,
    dataIndex: 'assetType',
  },
  {
    title: '成交笔数',
    width: 150,
    dataIndex: 'trdTransNum',
  },
  {
    title: '成交名义金额',
    width: 150,
    dataIndex: 'trdNotionAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '持仓笔数',
    width: 150,
    dataIndex: 'posTransNum',
  },
  {
    title: '持仓名义金额',
    width: 150,
    dataIndex: 'posNotionAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '参与交易客户数',
    width: 150,
    dataIndex: 'inMarketCusNum',
  },
];
