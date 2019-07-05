import { formatNumber, formatMoney } from '@/tools';

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
    title: '当日总盈亏 (¥)',
    align: 'right',
    dataIndex: 'dailyPnl',
    width: 130,
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: '当日期权盈亏 (¥)',
    align: 'right',
    dataIndex: 'dailyOptionPnl',
    width: 140,
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: '当日标的物盈亏 (¥)',
    align: 'right',
    dataIndex: 'dailyUnderlyerPnl',
    width: 150,
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: '当日新交易',
    dataIndex: 'pnlContributionNew',
    width: 130,
  },
  {
    title: '当日结算贡献',
    dataIndex: 'pnlContributionSettled',
    width: 130,
  },
  {
    title: 'Delta贡献 (¥)',
    align: 'right',
    dataIndex: 'pnlContributionDelta',
    width: 130,
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: 'Gamma贡献 (¥)',
    align: 'right',
    dataIndex: 'pnlContributionGamma',
    width: 130,
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: 'Vega贡献 (¥)',
    align: 'right',
    dataIndex: 'pnlContributionVega',
    width: 130,
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: 'Theta贡献 (¥)',
    align: 'right',
    dataIndex: 'pnlContributionTheta',
    width: 130,
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: 'Rho贡献 (¥)',
    align: 'right',
    dataIndex: 'pnlContributionRho',
    width: 130,
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: '其他贡献 (¥)',
    align: 'right',
    dataIndex: 'pnlContributionUnexplained',
    width: 130,
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: '定价环境',
    dataIndex: 'pricingEnvironment',
    width: 130,
  },
];
