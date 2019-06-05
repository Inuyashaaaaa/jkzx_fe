import { PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';
import { formatNumber } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    dataIndex: 'bookName',
    title: '交易簿',
    fixed: true,
    width: 130,
  },
  {
    dataIndex: 'partyName',
    title: '交易对手',
  },
  {
    dataIndex: 'tradeId',
    title: '交易代码',
  },
  {
    dataIndex: 'underlyerInstrumentId',
    title: '标的物代码',
  },
  {
    title: '期权类型',
    dataIndex: 'productType',
    render: (value, record, index) => PRODUCTTYPE_ZHCH_MAP[value],
  },
  {
    dataIndex: 'tradeDate',
    title: '交易日',
    sorter: true,
    sortDirections: ['ascend', 'descend'],
  },
  {
    dataIndex: 'initialNumber',
    title: '期初数量 (手)',
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    dataIndex: 'unwindNumber',
    title: '平仓数量 (手)',
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    dataIndex: 'number',
    title: '持仓数量 (手)',
    align: 'right',
    render: (value, reocrd, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'premium',
    title: '期权费 (¥)',
    align: 'right',
    render: (value, reocrd, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'unwindAmount',
    title: '平仓金额 (¥)',
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    dataIndex: 'marketValue',
    title: '市值 (¥)',
    align: 'right',
    render: (value, reocrd, index) => formatNumber(value, 4),
  },
  {
    dataIndex: 'pnl',
    title: '盈亏 (¥)',
    align: 'right',
    render: (value, reocrd, index) => formatNumber(value, 4),
  },
  {
    title: 'Delta (手)',
    dataIndex: 'delta',
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'Delta Cash (手)',
    dataIndex: 'deltaCash',
    render: (value, record, index) => {
      return formatNumber(value, 4);
    },
    align: 'right',
  },
  {
    title: 'Delta Decay (手)',
    dataIndex: 'deltaDecay',
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    dataIndex: 'deltaWithDecay',
    title: '预期Delta (手)',
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'Gamma (手)',
    dataIndex: 'gamma',
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'Gamma 金额 (¥)',
    dataIndex: 'gammaCash',
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    dataIndex: 'rho',
    title: 'Rho/1% (¥)',
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    dataIndex: 'theta',
    title: 'Theta/1天 (¥)',
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    dataIndex: 'vega',
    title: 'Vega/1% (¥)',
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
];
