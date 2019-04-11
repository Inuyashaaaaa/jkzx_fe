import {
  INPUT_NUMBER_DATE_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  PRODUCT_TYPE_OPTIONS,
} from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';

export const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易簿',
    field: 'bookName',
  },
  {
    headerName: '交易对手',
    field: 'partyName',
  },
  {
    headerName: '持仓编号',
    field: 'positionId',
  },
  {
    headerName: '交易代码',
    field: 'tradeId',
  },
  {
    headerName: '标的物代码',
    field: 'underlyerInstrumentId',
  },
  {
    headerName: '期权类型',
    field: 'productType',
    input: {
      type: 'select',
      options: PRODUCT_TYPE_OPTIONS,
    },
  },
  {
    headerName: '期初数量 (手)',
    field: 'initialNumber',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '平仓数量 (手)',
    field: 'unwindNumber',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '持仓数量 (手)',
    field: 'number',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '期权费 (¥)',
    field: 'premium',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '平仓金额 (¥)',
    field: 'unwindAmount',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '市值 (¥)',
    field: 'marketValue',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '盈亏 (¥)',
    field: 'pnl',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Delta (手)',
    field: 'delta',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Delta Decay (手)',
    field: 'deltaDecay',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '预期Delta (手)',
    field: 'deltaWithDecay',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Gamma (手)',
    field: 'gamma',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Gamma金额 (¥)',
    field: 'gammaCash',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Vega/1% (¥)',
    field: 'vega',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Theta/1天 (¥)',
    field: 'theta',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: 'Rho/1% (¥)',
    field: 'rho',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '交易日',
    field: 'tradeDate',
    input: INPUT_NUMBER_DATE_CONFIG,
  },
  {
    headerName: '到期日',
    field: 'expirationDate',
  },
  {
    headerName: '标的物价格 (¥)',
    field: 'underlyerPrice',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '错误信息',
    field: 'message',
    width: 200,
  },
];
