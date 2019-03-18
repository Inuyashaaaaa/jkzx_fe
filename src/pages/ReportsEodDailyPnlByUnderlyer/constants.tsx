import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';

export const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易簿',
    field: 'bookName',
  },
  {
    headerName: '标的物代码',
    field: 'underlyerInstrumentId',
  },
  {
    headerName: '当日总盈亏 (¥)',
    field: 'dailyPnl',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '当日期权盈亏 (¥)',
    field: 'dailyOptionPnl',
    width: 140,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '当日标的物盈亏 (¥)',
    field: 'dailyUnderlyerPnl',
    width: 150,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Delta贡献 (¥)',
    field: 'pnlContributionDelta',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Gamma贡献 (¥)',
    field: 'pnlContributionGamma',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Vega贡献 (¥)',
    field: 'pnlContributionVega',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Theta贡献 (¥)',
    field: 'pnlContributionTheta',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Rho贡献 (¥)',
    field: 'pnlContributionRho',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '其他贡献 (¥)',
    field: 'pnlContributionUnexplained',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];
