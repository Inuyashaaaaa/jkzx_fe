import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';

export const PAGE_TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易簿',
    field: 'bookName',
    width: 130,
  },
  {
    headerName: '标的物代码',
    field: 'underlyerInstrumentId',
    width: 130,
  },
  {
    headerName: '当日总盈亏 (¥)',
    field: 'dailyPnl',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '当日期权盈亏 (¥)',
    field: 'dailyOptionPnl',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '当日标的物盈亏 (¥)',
    field: 'dailyUnderlyerPnl',
    width: 150,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Delta 贡献 (¥)',
    field: 'pnlContributionDelta',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Vega 贡献 (¥)',
    field: 'pnlContributionVega',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Theta 贡献 (¥)',
    field: 'pnlContributionTheta',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Rho 贡献 (¥)',
    field: 'pnlContributionRho',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '其它贡献 (¥)',
    field: 'pnlContributionUnexplained',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];
