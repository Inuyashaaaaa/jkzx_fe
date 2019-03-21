import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';

export const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: 'SAC协议编码',
    field: 'masterAgreementId',
  },
  {
    headerName: '客户名称',
    field: 'clientName',
  },
  {
    headerName: '财务录入资金',
    children: [
      {
        headerName: '客户入金金额 (¥)',
        field: 'paymentIn',
        input: INPUT_NUMBER_DIGITAL_CONFIG,
      },
      {
        headerName: '客户出金金额 (¥)',
        field: 'paymentOut',
        input: INPUT_NUMBER_DIGITAL_CONFIG,
      },
    ],
  },
  {
    headerName: '交易权利金收支',
    children: [
      {
        headerName: '期权收取权利金 (¥)',
        field: 'premiumBuy',
        input: INPUT_NUMBER_DIGITAL_CONFIG,
      },
      {
        headerName: '期权支出权利金 (¥)',
        field: 'premiumSell',
        input: INPUT_NUMBER_DIGITAL_CONFIG,
      },
    ],
  },
  {
    headerName: '交易了结盈亏/赔付',
    children: [
      {
        headerName: '期权了结盈利 (¥)',
        field: 'profitAmount',
        input: INPUT_NUMBER_DIGITAL_CONFIG,
      },
      {
        headerName: '期权了结赔付 (¥)',
        field: 'lossAmount',
        input: INPUT_NUMBER_DIGITAL_CONFIG,
      },
    ],
  },
  {
    headerName: '场外预付金金额 (¥)',
    field: 'fundTotal',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];
