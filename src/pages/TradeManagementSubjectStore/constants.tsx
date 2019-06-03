import { formatNumber } from '@/tools';
import {
  EXERCISETYPE_MAP_CN,
  EQUITY_EXCHANGE_ZHCN_MAP,
  COMMODITY_EXCHANGE_ZHCN_MAP,
  ASSET_CLASS_ZHCN_MAP,
  INSTRUMENT_TYPE_ZHCN_MAP,
  OPTION_TYPE_ZHCN_MAP,
} from '@/constants/common';
import React from 'react';
import Operation from './Operation';

export const TABLE_COL_DEFS = fetchTable => [
  {
    title: '合约代码',
    dataIndex: 'instrumentId',
  },
  {
    title: '合约名称',
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
    render: (value, record, index) => ASSET_CLASS_ZHCN_MAP[value] || value,
  },
  {
    title: '合约类型',
    dataIndex: 'instrumentType',
    render: (value, record, index) => INSTRUMENT_TYPE_ZHCN_MAP[value] || value,
  },
  {
    title: '合约乘数',
    dataIndex: 'multiplier',
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
    title: '标的代码',
    dataIndex: 'underlyerInstrumentId',
  },
  {
    title: '行权价格',
    dataIndex: 'strike',
  },
  {
    title: '行权方式',
    dataIndex: 'exerciseType',
    render: value => EXERCISETYPE_MAP_CN[value] || value,
  },
  {
    title: '期权类型',
    dataIndex: 'optionType',
    render: value => OPTION_TYPE_ZHCN_MAP[value] || value,
  },
  {
    title: '到期日',
    dataIndex: 'maturity',
  },
  {
    title: '期权到期日',
    dataIndex: 'expirationDate',
  },
  {
    title: '期权到期时间',
    dataIndex: 'expirationTime',
  },
  {
    dataIndex: 'operation',
    title: '操作',
    render: (value, record, index) => {
      return <Operation record={record} fetchTable={fetchTable} />;
    },
  },
];
