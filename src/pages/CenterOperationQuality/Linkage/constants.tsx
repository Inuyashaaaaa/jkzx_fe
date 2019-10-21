import React from 'react';
import moment from 'moment';
import { formatNumber } from '@/tools';

export const MarketDefs = [
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
    title: '品种',
    width: 200,
    dataIndex: 'commodityId',
  },
  {
    title: '子公司名称',
    width: 200,
    dataIndex: 'mainBodyName',
  },
  {
    title: '子公司场外持仓金额',
    align: 'right',
    width: 200,
    dataIndex: 'otcSubPosAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '子公司场内持仓金额',
    align: 'right',
    width: 200,
    dataIndex: 'etSubPosAmount',
    render: val => val && formatNumber(val, 4),
  },
];
export const VarietiesDefs = [
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
    title: '品种',
    width: 150,
    dataIndex: 'commodityId',
  },
  {
    title: '场外持仓名义金额',
    align: 'right',
    width: 200,
    dataIndex: 'otcPosAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '场外持仓比例',
    align: 'right',
    width: 150,
    dataIndex: 'otcPosRatio',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '场内持仓金额',
    align: 'right',
    width: 150,
    dataIndex: 'etPosAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '场内持仓比例',
    align: 'right',
    width: 150,
    dataIndex: 'etPosRatio',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '当月倍数（场外持仓比例/场内持仓比例）',
    align: 'right',
    width: 400,
    dataIndex: 'otcEtRatio',
    render: val => val && formatNumber(val, 4),
  },
];
export const CounterpartyDefs = [
  {
    title: '日期',
    align: 'right',
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
    title: '在场内开户的交易对手方个数',
    align: 'right',
    width: 300,
    dataIndex: 'etAccountCusNum',
  },
  {
    title: '场内开户对手方场外持仓名义金额',
    align: 'right',
    width: 350,
    dataIndex: 'otcCusPosAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '交易对手方场内持仓金额',
    align: 'right',
    width: 250,
    dataIndex: 'etCusPosAmount',
    render: val => val && formatNumber(val, 4),
  },
  {
    title: '对应账户的场内总权益',
    align: 'right',
    width: 250,
    dataIndex: 'etCusRight',
    render: val => val && formatNumber(val, 4),
  },
];
