import { formatMoney } from '@/tools';

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
    align: 'right',
    render: (value, record, index) => formatMoney(value),
  },
  {
    title: 'Gamma 金额 (¥)',
    dataIndex: 'gammaCash',
    width: 130,
    align: 'right',
    render: (value, record, index) => formatMoney(value),
  },
  {
    title: 'Vega/1% (¥)',
    dataIndex: 'vega',
    width: 130,
    align: 'right',
    render: (value, record, index) => formatMoney(value),
  },
  {
    title: 'Theta/1天 (¥)',
    dataIndex: 'theta',
    width: 130,
    align: 'right',
    render: (value, record, index) => formatMoney(value),
  },
  {
    title: 'Rho/1% (¥)',
    dataIndex: 'rho',
    width: 130,
    align: 'right',
    render: (value, record, index) => formatMoney(value),
  },
  {
    title: '定价环境',
    dataIndex: 'pricingEnvironment',
    width: 130,
  },
];
