import { formatNumber, formatMoney } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    title: '交易簿',
    dataIndex: 'bookName',
    width: 130,
    sorter: true,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: '标的物代码',
    dataIndex: 'underlyerInstrumentId',
    width: 130,
    sorter: true,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: '当日总盈亏 (¥)',
    dataIndex: 'dailyPnl',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: '当日期权盈亏 (¥)',
    dataIndex: 'dailyOptionPnl',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: '当日标的物盈亏 (¥)',
    dataIndex: 'dailyUnderlyerPnl',
    width: 150,
    align: 'right',
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: 'Delta 贡献 (¥)',
    dataIndex: 'pnlContributionDelta',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: 'Vega 贡献 (¥)',
    dataIndex: 'pnlContributionVega',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: 'Theta 贡献 (¥)',
    dataIndex: 'pnlContributionTheta',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: 'Rho 贡献 (¥)',
    dataIndex: 'pnlContributionRho',
    width: 130,
    align: 'right',
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
  {
    title: '其它贡献 (¥)',
    dataIndex: 'pnlContributionUnexplained',
    align: 'right',
    render: (value, record, index) => {
      return formatMoney(value);
    },
  },
];
