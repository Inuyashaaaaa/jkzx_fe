import { INPUT_NUMBER_DIGITAL_CONFIG, INPUT_NUMBER_PERCENTAGE_CONFIG } from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';

export const TABLE_COL_DEFS: IColumnDef[] = [
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
    headerName: '标的物价格 (¥)',
    field: 'underlyerPrice',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '标的物价格变化 (%)',
    field: 'underlyerPriceChangePercent',
    width: 150,
    input: INPUT_NUMBER_PERCENTAGE_CONFIG,
  },
  {
    headerName: '标的物持仓 (手)',
    field: 'underlyerNetPosition',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '期权 Delta (手)',
    field: 'delta',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '净 Delta (手)',
    field: 'netDelta',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Delta Decay (手)',
    field: 'deltaDecay',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },

  {
    headerName: '预期 Delta (手)',
    field: 'deltaWithDecay',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Gamma (手)',
    field: 'gamma',
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
