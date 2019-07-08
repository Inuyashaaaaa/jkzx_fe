import { multiply } from 'mathjs';
import { PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';
import { formatNumber } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    title: '持仓ID',
    dataIndex: 'tradeId',
    fixed: 'left',
    width: 150,
  },
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
    title: '标的物代码',
    dataIndex: 'underlyerInstrumentId',
    width: 150,
  },
  {
    title: '期权类型',
    dataIndex: 'productType',
    width: 150,
    render: (value, record, index) => PRODUCTTYPE_ZHCH_MAP[value],
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
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: '平仓数量 (手)',
    dataIndex: 'unwindNumber',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: '持仓数量 (手)',
    dataIndex: 'number',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: '期权费 (¥)',
    dataIndex: 'premium',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: '平仓金额 (¥)',
    dataIndex: 'unwindAmount',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: '市值 (¥)',
    dataIndex: 'marketValue',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: '盈亏 (¥)',
    dataIndex: 'pnl',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'Delta (手)',
    dataIndex: 'delta',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'Delta Cash (￥)',
    dataIndex: 'deltaCash',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'Delta Decay (手)',
    dataIndex: 'deltaDecay',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: '预期Delta (手)',
    dataIndex: 'deltaWithDecay',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'Gamma (手)',
    dataIndex: 'gamma',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'Gamma金额 (¥)',
    dataIndex: 'gammaCash',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'Vega/1% (¥)',
    dataIndex: 'vega',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'Theta/1天 (¥)',
    dataIndex: 'theta',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'Rho/1% (¥)',
    dataIndex: 'rho',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
    align: 'right',
  },
  {
    title: 'vol',
    dataIndex: 'vol',
    width: 130,
    align: 'right',
    render: text => {
      if (text == null) return text;
      return text === +text ? `${formatNumber(multiply(text, 100), 4)}%` : text;
    },
  },
  {
    title: 'r',
    dataIndex: 'r',
    width: 130,
    align: 'right',
    render: text => {
      if (text == null) return text;
      return text === +text ? `${formatNumber(multiply(text, 100), 4)}%` : text;
    },
  },
  {
    title: 'q',
    dataIndex: 'q',
    width: 130,
    align: 'right',
    render: text => {
      if (text == null) return text;
      return text === +text ? `${formatNumber(multiply(text, 100), 4)}%` : text;
    },
  },
  {
    title: '定价环境',
    dataIndex: 'pricingEnvironment',
    width: 130,
  },
  {
    title: '错误信息',
    dataIndex: 'message',
  },
];
