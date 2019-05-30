import { PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';
import { formatNumber } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    dataIndex: 'bookName',
    title: '交易簿',
    width: 130,
    fixed: true,
  },
  {
    dataIndex: 'partyName',
    title: '交易对手',
    width: 130,
  },
  {
    dataIndex: 'tradeId',
    title: '交易代码',
    width: 130,
  },
  {
    dataIndex: 'underlyerInstrumentId',
    title: '标的物代码',
    width: 130,
  },
  {
    title: '期权类型',
    dataIndex: 'productType',
    width: 130,
    render: (value, record, index) => PRODUCTTYPE_ZHCH_MAP[value],
  },
  {
    dataIndex: 'tradeDate',
    title: '交易日',
    width: 130,
    sorter: true,
    sortDirections: ['ascend', 'descend'],
  },
  {
    dataIndex: 'initialNumber',
    title: '期初数量 (手)',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'unwindNumber',
    title: '平仓数量 (手)',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'number',
    title: '持仓数量 (手)',
    width: 130,
    render: (value, reocrd, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'premium',
    title: '期权费 (¥)',
    width: 130,
    render: (value, reocrd, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'unwindAmount',
    title: '平仓金额 (¥)',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'marketValue',
    title: '市值 (¥)',
    width: 130,
    render: (value, reocrd, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'pnl',
    title: '盈亏 (¥)',
    width: 130,
    render: (value, reocrd, index) => formatNumber(value, 4),
  },
  {
    title: 'Delta (手)',
    dataIndex: 'delta',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    title: 'Delta Cash (手)',
    dataIndex: 'deltaCash',
    width: 130,
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
  },
  {
    title: 'Delta Decay (手)',
    dataIndex: 'deltaDecay',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'deltaWithDecay',
    title: '预期Delta (手)',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    title: 'Gamma (手)',
    dataIndex: 'gamma',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    title: 'Gamma 金额 (¥)',
    dataIndex: 'gammaCash',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'rho',
    title: 'Rho/1% (¥)',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'theta',
    title: 'Theta/1天 (¥)',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'vega',
    title: 'Vega/1% (¥)',
    render: (value, record, index) => formatNumber(value, 4),
  },
];
