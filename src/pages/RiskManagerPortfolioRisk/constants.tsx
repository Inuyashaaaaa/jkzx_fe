import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';

export const PAGE_TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '投资组合',
    field: 'portfolioName',
    width: 130,
  },
  {
    headerName: 'Delta 金额 (¥)',
    field: 'deltaCash',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Gamma 金额 (¥)',
    field: 'gammaCash',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Vega/1% (¥)',
    field: 'vega',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Theta/1天 (¥)',
    field: 'theta',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Rho/1% (¥)',
    field: 'rho',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];
