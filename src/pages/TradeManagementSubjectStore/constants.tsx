import { formatNumber } from '@/tools';
import {
  EQUITY_EXCHANGE_ZHCN_MAP,
  COMMODITY_EXCHANGE_ZHCN_MAP,
  ASSET_CLASS_ZHCN_MAP,
  INSTRUMENT_TYPE_ZHCN_MAP,
} from '@/constants/common';
import React from 'react';
import Operation from './Operation';

export const TABLE_COL_DEFS = fetchTable => [
  {
    title: '标的物代码',
    dataIndex: 'instrumentId',
  },
  {
    title: '标的物名称',
    dataIndex: 'name',
  },
  {
    title: '交易所',
    dataIndex: 'exchange',
    render: (value, record, index) => {
      return {
        ...EQUITY_EXCHANGE_ZHCN_MAP,
        ...COMMODITY_EXCHANGE_ZHCN_MAP,
      }[value];
    },
  },
  {
    title: '资产类别',
    dataIndex: 'assetClass',
    render: (value, record, index) => ASSET_CLASS_ZHCN_MAP[value],
  },
  {
    title: '合约类型',
    dataIndex: 'instrumentType',
    render: (value, record, index) => INSTRUMENT_TYPE_ZHCN_MAP[value],
  },
  {
    title: '合约乘数',
    dataIndex: 'multiplier',
    align: 'right',
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    title: '报价单位',
    dataIndex: 'unit',
  },
  {
    title: '交易品种',
    dataIndex: 'tradeCategory',
  },
  {
    title: '期货到期日',
    dataIndex: 'maturity',
  },
  {
    dataIndex: 'operation',
    title: '操作',
    render: (value, record, index) => {
      return <Operation record={record} fetchTable={fetchTable} />;
    },
  },
];
