import {
  INPUT_NUMBER_DATE_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  PRODUCT_TYPE_OPTIONS,
} from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';

export const PAGE_TABLE_COL_DEFS: IColumnDef[] = [
  { field: 'tradeId', headerName: '交易代码', width: 130 },

  { field: 'partyName', headerName: '交易对手', width: 130 },

  { field: 'tradeDate', headerName: '交易日', width: 130, input: INPUT_NUMBER_DATE_CONFIG },

  { field: 'bookName', headerName: '交易簿', width: 130 },

  {
    headerName: 'Delta (手)',
    field: 'delta',
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

  { field: 'rho', headerName: 'Rho/1% (¥)', width: 130, input: INPUT_NUMBER_DIGITAL_CONFIG },

  { field: 'theta', headerName: 'Theta/1天 (¥)', width: 130, input: INPUT_NUMBER_DIGITAL_CONFIG },

  { field: 'vega', headerName: 'Vega/1% (¥)', width: 130, input: INPUT_NUMBER_DIGITAL_CONFIG },

  { field: 'marketValue', headerName: '市值 (¥)', width: 130, input: INPUT_NUMBER_DIGITAL_CONFIG },

  {
    field: 'unwindNumber',
    headerName: '平仓数量 (手)',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },

  {
    field: 'unwindAmount',
    headerName: '平仓金额 (¥)',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },

  { field: 'number', headerName: '持仓数量 (手)', width: 130, input: INPUT_NUMBER_DIGITAL_CONFIG },

  {
    field: 'initialNumber',
    headerName: '期初数量 (手)',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },

  {
    field: 'productType',
    headerName: '期权类型',
    width: 130,
    input: {
      type: 'select',
      option: PRODUCT_TYPE_OPTIONS,
    },
  },

  { field: 'premium', headerName: '期权费 (¥)', width: 130, input: INPUT_NUMBER_DIGITAL_CONFIG },

  {
    field: 'underlyerInstrumentId',
    headerName: '标的物代码',
    width: 130,
  },

  { field: 'pnl', headerName: '盈亏 (¥)', width: 130, input: INPUT_NUMBER_DIGITAL_CONFIG },

  {
    field: 'deltaWithDecay',
    headerName: '预期Delta (手)',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];
