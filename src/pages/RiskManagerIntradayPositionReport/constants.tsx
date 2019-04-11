import { INPUT_NUMBER_DIGITAL_CONFIG, PRODUCT_TYPE_OPTIONS } from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';

export const PAGE_TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易簿',
    field: 'bookName',
    width: 130,
  },
  {
    headerName: '交易对手',
    field: 'partyName',
    width: 130,
  },
  {
    headerName: '交易代码',
    field: 'tradeId',
    width: 130,
  },
  {
    headerName: '标的物代码',
    field: 'underlyerInstrumentId',
    width: 130,
  },
  {
    headerName: '期权类型',
    field: 'productType',
    width: 130,
    input: {
      type: 'select',
      options: PRODUCT_TYPE_OPTIONS,
    },
  },
  {
    headerName: '期初数量 (手)',
    field: 'initialNumber',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '平仓数量 (手)',
    field: 'unwindNumber',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '持仓数量 (手)',
    field: 'number',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '期权费 (¥)',
    field: 'premium',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },

  {
    headerName: '平仓金额 (¥)',
    field: 'unwindAmount',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '市值 (¥)',
    field: 'marketValue',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '盈亏 (¥)',
    field: 'pnl',
    width: 130,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
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
  {
    headerName: '交易日',
    field: 'tradeDate',
    width: 130,
    input: {
      type: 'date',
    },
  },
  {
    headerName: '到期日',
    field: 'expirationDate',
    width: 130,
    input: {
      type: 'date',
    },
  },
  {
    headerName: '错误信息',
    field: 'message',
    width: 200,
  },
];
