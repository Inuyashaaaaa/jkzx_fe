import React from 'react';
import moment from 'moment';
import { formatNumber } from '@/tools';

export const KnockdownStructureDefs = [
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
    title: '开仓成交名义金额',
    align: 'right',
    width: 200,
    dataIndex: 'openTrdNotionAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '平仓成交名义金额',
    align: 'right',
    width: 200,
    dataIndex: 'closeTrdNotionAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '终止成交名义金额',
    align: 'right',
    width: 200,
    dataIndex: 'endTrdNotionAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '成交名义金额',
    align: 'right',
    width: 200,
    dataIndex: 'trdNotionAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '开仓期权费金额',
    align: 'right',
    width: 200,
    dataIndex: 'trdOpenPremium',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '平仓期权费金额',
    align: 'right',
    width: 200,
    dataIndex: 'trdClosePremium',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '终止期权费金额',
    align: 'right',
    width: 200,
    dataIndex: 'trdEndPremium',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '期权费金额',
    align: 'right',
    width: 200,
    dataIndex: 'premiumAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '开仓成交客户数',
    align: 'right',
    width: 200,
    dataIndex: 'trdOpenCusNum',
    render: val => <span>{val}</span>,
  },
  {
    title: '平仓成交客户数',
    align: 'right',
    width: 200,
    dataIndex: 'trdCloseCusNum',
    render: val => <span>{val}</span>,
  },
  {
    title: '终止成交客户数',
    align: 'right',
    width: 200,
    dataIndex: 'trdEndCusNum',
    render: val => <span>{val}</span>,
  },
  {
    title: '成交客户数',
    align: 'right',
    width: 200,
    dataIndex: 'trdCusNum',
    render: val => <span>{val}</span>,
  },
];
export const PositionStructureDefs = [
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
    title: '买看涨持仓名义金额',
    width: 250,
    align: 'right',
    dataIndex: 'posCallBuyAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '买看跌持仓名义金额',
    width: 250,
    align: 'right',
    dataIndex: 'posPutBuyAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '买其他持仓名义金额',
    align: 'right',
    width: 250,
    dataIndex: 'posOtherBuyAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '买名义金额合计',
    align: 'right',
    width: 200,
    dataIndex: 'posBuyAmountTotal',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '卖看涨持仓名义金额',
    align: 'right',
    width: 250,
    dataIndex: 'posCallSellAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '卖看跌持仓名义金额',
    align: 'right',
    width: 250,
    dataIndex: 'posPutSellAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '卖名义金额合计',
    align: 'right',
    width: 200,
    dataIndex: 'posSellAmountTotal',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '买看涨持仓市值',
    align: 'right',
    width: 200,
    dataIndex: 'posCallBuyCValue',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '买看跌持仓市值',
    align: 'right',
    width: 200,
    dataIndex: 'posPutBuyCValue',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '买其他持仓市值',
    align: 'right',
    width: 200,
    dataIndex: 'posOtherBuyCValue',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '买市值合计',
    align: 'right',
    width: 200,
    dataIndex: 'posBuyValueTotal',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '卖看涨持仓市值',
    align: 'right',
    width: 200,
    dataIndex: 'posCallSellCValue',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '卖看跌持仓市值',
    align: 'right',
    width: 200,
    dataIndex: 'posPutSellCValue',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '卖市值合计',
    align: 'right',
    width: 200,
    dataIndex: 'posSellValueTotal',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
];

export const ToolStructureDefs = [
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
    title: '资产类型',
    width: 150,
    dataIndex: 'assetType',
    render: val => <span>{val}</span>,
  },
  {
    title: '工具类型',
    width: 150,
    dataIndex: 'toolType',
    render: val => <span>{val}</span>,
  },
  {
    title: '成交笔数',
    align: 'right',
    width: 150,
    dataIndex: 'trdTransNum',
    render: val => <span>{val}</span>,
  },
  {
    title: '成交名义金额',
    align: 'right',
    width: 150,
    dataIndex: 'trdNotionAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '持仓笔数',
    width: 150,
    align: 'right',
    dataIndex: 'posTransNum',
    render: val => <span>{val}</span>,
  },
  {
    title: '持仓名义金额',
    width: 150,
    align: 'right',
    dataIndex: 'posNotionAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '参与交易客户数',
    width: 150,
    align: 'right',
    dataIndex: 'inMarketCusNum',
    render: val => <span>{val}</span>,
  },
];
export const CustomerTypeStructureDefs = [
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
    title: '对手方类型',
    width: 150,
    dataIndex: 'cusType',
    render: val => <span>{val}</span>,
  },
  {
    title: '资产类型',
    width: 150,
    dataIndex: 'assetType',
    render: val => <span>{val}</span>,
  },
  {
    title: '成交笔数',
    align: 'right',
    width: 150,
    dataIndex: 'trdTransNum',
    render: val => <span>{val}</span>,
  },
  {
    title: '成交名义金额',
    align: 'right',
    width: 150,
    dataIndex: 'trdNotionAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '持仓笔数',
    align: 'right',
    width: 150,
    dataIndex: 'posTransNum',
    render: val => <span>{val}</span>,
  },
  {
    title: '持仓名义金额',
    align: 'right',
    width: 150,
    dataIndex: 'posNotionAmount',
    render: val => <span>{val && formatNumber(val, 2)}</span>,
  },
  {
    title: '参与交易客户数',
    align: 'right',
    width: 200,
    dataIndex: 'inMarketCusNum',
    render: val => <span>{val}</span>,
  },
];
