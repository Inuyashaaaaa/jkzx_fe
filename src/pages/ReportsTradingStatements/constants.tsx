import {
  ASSET_TYPE_OPTIONS,
  DIRECTION_OPTIONS,
  INPUT_NUMBER_DATE_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
} from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';

export const TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: 'SAC协议编码',
    field: 'masterAgreementId',
  },
  {
    headerName: '交易确认书编码',
    field: 'reportName',
  },
  {
    headerName: '客户名称',
    field: 'client',
  },
  {
    headerName: '开始日期',
    field: 'dealStartDate',
    input: INPUT_NUMBER_DATE_CONFIG,
  },
  {
    headerName: '到期日期',
    field: 'expiry',
    input: INPUT_NUMBER_DATE_CONFIG,
  },
  {
    headerName: '买卖方向',
    field: 'side',
    input: {
      type: 'select',
      options: DIRECTION_OPTIONS,
    },
  },
  {
    headerName: '标的资产名称',
    field: 'baseContract',
  },
  {
    headerName: '标的资产类型',
    field: 'assetType',
    input: {
      type: 'select',
      options: ASSET_TYPE_OPTIONS,
    },
  },
  {
    headerName: '名义金额 (¥)',
    field: 'nominalPrice',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '期权费 (¥)',
    field: 'beginPremium',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '市值 (¥)',
    field: 'endPremium',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '总盈亏 (¥)',
    field: 'totalPremium',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '实际平仓日期',
    field: 'endDate',
    input: INPUT_NUMBER_DATE_CONFIG,
  },
  {
    headerName: '存续状态',
    field: 'status',
  },
];
