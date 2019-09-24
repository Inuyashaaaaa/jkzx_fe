import { formatMoney, getMoment } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    title: '投资组合',
    dataIndex: 'portfolioName',
    width: 130,
  },
  {
    title: '更新时间',
    dataIndex: 'createdAt',
    width: 180,
    render: (value, record, index) => (value ? getMoment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
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
