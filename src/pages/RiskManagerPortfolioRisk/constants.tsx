import { formatNumber } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    title: '投资组合',
    dataIndex: 'portfolioName',
    width: 130,
  },
  {
    title: 'Delta 金额 (¥)',
    dataIndex: 'deltaCash',
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
    title: 'Vega/1% (¥)',
    dataIndex: 'vega',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    title: 'Theta/1天 (¥)',
    dataIndex: 'theta',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
  {
    title: 'Rho/1% (¥)',
    dataIndex: 'rho',
    width: 130,
    render: (value, record, index) => formatNumber(value, 4),
  },
];
