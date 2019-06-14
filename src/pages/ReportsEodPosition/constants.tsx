import { PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';
import { formatNumber } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    title: '交易簿',
    dataIndex: 'bookName',
    fixed: 'left',
    width: 150,
  },
  {
    title: '交易对手',
    dataIndex: 'partyName',
    width: 150,
  },
  {
    title: '持仓编号',
    dataIndex: 'positionId',
    width: 150,
  },
  {
    title: '交易代码',
    dataIndex: 'tradeId',
    width: 150,
  },
  {
    title: '标的物代码',
    dataIndex: 'underlyerInstrumentId',
    width: 150,
  },
  {
    title: '期权类型',
    dataIndex: 'productType',
    width: 150,
    render: (value, record, index) => {
      return PRODUCTTYPE_ZHCH_MAP[value];
    },
  },
  {
    title: '交易日',
    dataIndex: 'tradeDate',
    width: 112,
    sorter: true,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: '到期日',
    dataIndex: 'expirationDate',
    width: 120,
    sorter: true,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: '期初数量 (手)',
    dataIndex: 'initialNumber',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: '平仓数量 (手)',
    dataIndex: 'unwindNumber',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: '持仓数量 (手)',
    dataIndex: 'number',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: '期权费 (¥)',
    dataIndex: 'premium',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: '平仓金额 (¥)',
    dataIndex: 'unwindAmount',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: '市值 (¥)',
    dataIndex: 'marketValue',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: '盈亏 (¥)',
    dataIndex: 'pnl',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: 'Delta (手)',
    dataIndex: 'delta',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: 'Delta Cash (￥)',
    dataIndex: 'deltaCash',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: 'Delta Decay (手)',
    dataIndex: 'deltaDecay',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: '预期Delta (手)',
    dataIndex: 'deltaWithDecay',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: 'Gamma (手)',
    dataIndex: 'gamma',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: 'Gamma金额 (¥)',
    dataIndex: 'gammaCash',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: 'Vega/1% (¥)',
    dataIndex: 'vega',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: 'Theta/1天 (¥)',
    dataIndex: 'theta',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: 'Rho/1% (¥)',
    dataIndex: 'rho',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: '标的物价格 (¥)',
    dataIndex: 'underlyerPrice',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: '错误信息',
    dataIndex: 'message',
  },
];
