import { INPUT_NUMBER_DATE_CONFIG, INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';

export const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '客户名称',
    field: 'clientName',
  },
  {
    headerName: 'SAC协议编码',
    field: 'masterAgreementId',
  },
  {
    headerName: '出入金日期 (¥)',
    field: 'paymentDate',
    input: INPUT_NUMBER_DATE_CONFIG,
  },
  {
    headerName: '入金 (¥)',
    field: 'paymentIn',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '出金 (¥)',
    field: 'paymentOut',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '出入金净额 (¥)',
    field: 'paymentAmount',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];
