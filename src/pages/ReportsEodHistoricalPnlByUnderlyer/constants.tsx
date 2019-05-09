import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';
import { placement } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    title: '交易簿',
    dataIndex: 'bookName',
    sorter: true,
    sortDirections: ['ascend', 'descend'],
    width: 130,
  },
  {
    title: '标的物代码',
    dataIndex: 'underlyerInstrumentId',
    sorter: true,
    sortDirections: ['ascend', 'descend'],
    width: 130,
  },
  {
    title: '总盈亏 (¥)',
    dataIndex: 'pnl',
    width: 130,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '期权费 (¥)',
    dataIndex: 'optionPremium',
    width: 130,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '期权平仓金额 (¥)',
    dataIndex: 'optionUnwindAmount',
    width: 150,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '期权结算金额 (¥)',
    dataIndex: 'optionSettleAmount',
    width: 150,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '期权持仓市值 (¥)',
    dataIndex: 'optionMarketValue',
    width: 150,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '期权盈亏 (¥)',
    dataIndex: 'optionPnl',
    width: 130,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '标的物买入金额 (¥)',
    dataIndex: 'underlyerBuyAmount',
    width: 150,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '标的物卖出金额 (¥)',
    dataIndex: 'underlyerSellAmount',
    width: 150,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '标的物持仓 (手)',
    dataIndex: 'underlyerNetPosition',
    width: 130,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '标的物价格 (¥)',
    dataIndex: 'underlyerPrice',
    width: 130,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '标的物市值 (¥)',
    dataIndex: 'underlyerMarketValue',
    width: 130,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '标的物盈亏 (¥)',
    dataIndex: 'underlyerPnl',
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
];
