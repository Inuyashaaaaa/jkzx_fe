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
    headerName: '总盈亏 (¥)',
    field: 'pnl',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '期权费 (¥)',
    field: 'optionPremium',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '期权平仓金额 (¥)',
    field: 'optionUnwindAmount',
    width: 150,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '期权结算金额 (¥)',
    field: 'optionSettleAmount',
    width: 150,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '期权持仓市值 (¥)',
    field: 'optionMarketValue',
    width: 150,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '期权盈亏 (¥)',
    field: 'optionPnl',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '标的物买入金额 (¥)',
    field: 'underlyerBuyAmount',
    width: 150,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '标的物卖出金额 (¥)',
    field: 'underlyerSellAmount',
    width: 150,
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '标的物持仓 (手)',
    field: 'underlyerNetPosition',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '标的物价格 (¥)',
    field: 'underlyerPrice',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '标的物市值 (¥)',
    field: 'underlyerMarketValue',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '标的物盈亏 (¥)',
    field: 'underlyerPnl',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];
