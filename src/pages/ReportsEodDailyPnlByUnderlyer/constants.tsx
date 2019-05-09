import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { placement } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    title: '交易簿',
    dataIndex: 'bookName',
  },
  {
    title: '标的物代码',
    dataIndex: 'underlyerInstrumentId',
  },
  {
    title: '当日总盈亏 (¥)',
    dataIndex: 'dailyPnl',
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '当日期权盈亏 (¥)',
    dataIndex: 'dailyOptionPnl',
    width: 140,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '当日标的物盈亏 (¥)',
    dataIndex: 'dailyUnderlyerPnl',
    width: 150,
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: 'Delta贡献 (¥)',
    dataIndex: 'pnlContributionDelta',
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: 'Gamma贡献 (¥)',
    dataIndex: 'pnlContributionGamma',
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: 'Vega贡献 (¥)',
    dataIndex: 'pnlContributionVega',
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: 'Theta贡献 (¥)',
    dataIndex: 'pnlContributionTheta',
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: 'Rho贡献 (¥)',
    dataIndex: 'pnlContributionRho',
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
  {
    title: '其他贡献 (¥)',
    dataIndex: 'pnlContributionUnexplained',
    render: (value, record, index) => {
      return placement(value, 4);
    },
  },
];
