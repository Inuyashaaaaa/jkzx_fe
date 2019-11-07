import React from 'react';
import moment from 'moment';
import { formatNumber } from '@/tools';

export const KnockdownStructureDefs = [
  {
    title: '日期',
    width: 250,
    dataIndex: 'statDate',
    render: value => {
      if (value) {
        return moment(value).format('YYYY-MM-DD');
      }
      return value;
    },
  },
  {
    title: '开仓成交名义金额',
    align: 'right',
    width: 200,
    dataIndex: 'openTrdNotionAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '平仓成交名义金额',
    align: 'right',
    width: 200,
    dataIndex: 'closeTrdNotionAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '终止成交名义金额',
    align: 'right',
    width: 200,
    dataIndex: 'endTrdNotionAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '成交名义金额',
    align: 'right',
    width: 200,
    dataIndex: 'trdNotionAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '开仓期权费金额',
    align: 'right',
    width: 200,
    dataIndex: 'trdOpenPremium',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '平仓期权费金额',
    align: 'right',
    width: 200,
    dataIndex: 'trdClosePremium',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '终止期权费金额',
    align: 'right',
    width: 200,
    dataIndex: 'trdEndPremium',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '期权费金额',
    align: 'right',
    width: 200,
    dataIndex: 'premiumAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '开仓成交客户数',
    align: 'right',
    width: 200,
    dataIndex: 'trdOpenCusNum',
  },
  {
    title: '平仓成交客户数',
    align: 'right',
    width: 200,
    dataIndex: 'trdCloseCusNum',
  },
  {
    title: '终止成交客户数',
    align: 'right',
    width: 200,
    dataIndex: 'trdEndCusNum',
  },
  {
    title: '成交客户数',
    align: 'right',
    width: 200,
    dataIndex: 'trdCusNum',
  },
];
export const PositionStructureDefs = [
  {
    title: '日期',
    width: 250,
    dataIndex: 'statDate',
    render: value => {
      if (value) {
        return moment(value).format('YYYY-MM-DD');
      }
      return value;
    },
  },
  {
    title: '买看涨持仓名义金额',
    width: 250,
    align: 'right',
    dataIndex: 'posCallBuyAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '买看跌持仓名义金额',
    width: 250,
    align: 'right',
    dataIndex: 'posPutBuyAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '买其他持仓名义金额',
    align: 'right',
    width: 250,
    dataIndex: 'posOtherBuyAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '买名义金额合计',
    align: 'right',
    width: 200,
    dataIndex: 'posBuyAmountTotal',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '卖看涨持仓名义金额',
    align: 'right',
    width: 250,
    dataIndex: 'posCallSellAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '卖看跌持仓名义金额',
    align: 'right',
    width: 250,
    dataIndex: 'posPutSellAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '卖名义金额合计',
    align: 'right',
    width: 200,
    dataIndex: 'posSellAmountTotal',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '买看涨持仓市值',
    align: 'right',
    width: 200,
    dataIndex: 'posCallBuyCValue',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '买看跌持仓市值',
    align: 'right',
    width: 200,
    dataIndex: 'posPutBuyCValue',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '买其他持仓市值',
    align: 'right',
    width: 200,
    dataIndex: 'posOtherBuyCValue',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '买市值合计',
    align: 'right',
    width: 200,
    dataIndex: 'posBuyValueTotal',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '卖看涨持仓市值',
    align: 'right',
    width: 200,
    dataIndex: 'posCallSellCValue',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '卖看跌持仓市值',
    align: 'right',
    width: 200,
    dataIndex: 'posPutSellCValue',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '卖市值合计',
    align: 'right',
    width: 200,
    dataIndex: 'posSellValueTotal',
    render: val => val && formatNumber(val, 2),
  },
];

export const ToolStructureDefs = [
  {
    title: '日期',
    width: 250,
    dataIndex: 'statDate',
    render: value => {
      if (value) {
        return moment(value).format('YYYY-MM-DD');
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
    title: '成交笔数',
    align: 'right',
    width: 150,
    dataIndex: 'trdTransNum',
  },
  {
    title: '成交名义金额',
    align: 'right',
    width: 150,
    dataIndex: 'trdNotionAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '持仓笔数',
    width: 150,
    align: 'right',
    dataIndex: 'posTransNum',
  },
  {
    title: '持仓名义金额',
    width: 150,
    align: 'right',
    dataIndex: 'posNotionAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '参与交易客户数',
    width: 150,
    align: 'right',
    dataIndex: 'inMarketCusNum',
  },
];
export const CustomerTypeStructureDefs = [
  {
    title: '日期',
    width: 250,
    dataIndex: 'statDate',
    render: value => {
      if (value) {
        return moment(value).format('YYYY-MM-DD');
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
    align: 'right',
    width: 150,
    dataIndex: 'trdTransNum',
  },
  {
    title: '成交名义金额',
    align: 'right',
    width: 150,
    dataIndex: 'trdNotionAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '持仓笔数',
    align: 'right',
    width: 150,
    dataIndex: 'posTransNum',
  },
  {
    title: '持仓名义金额',
    align: 'right',
    width: 150,
    dataIndex: 'posNotionAmount',
    render: val => val && formatNumber(val, 2),
  },
  {
    title: '参与交易客户数',
    align: 'right',
    width: 200,
    dataIndex: 'inMarketCusNum',
  },
];
