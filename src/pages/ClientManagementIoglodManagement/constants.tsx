import { INPUT_NUMBER_DIGITAL_CONFIG, IOGLOD_EVENT_TYPE_OPTIONS } from '@/constants/common';
import { IColumnDef } from '@/containers/Table/types';

export const HISTORY_COL_DEFS: IColumnDef[] = [
  {
    headerName: '交易对手',
    field: 'legalName',
    pinned: 'left',
  },
  {
    headerName: '交易ID',
    field: 'tradeId',
  },
  {
    headerName: '操作状态',
    field: 'status',
    input: {
      type: 'select',
      options: [
        {
          label: '正常',
          value: 'NORMAL',
        },
        {
          label: '错误',
          value: 'INVALID',
        },
      ],
      // formatValue: value => {
      //   if (value === 'NORMAL') {
      //     return '正常';
      //   }
      //   return '错误';
      // },
    },
  },
  {
    headerName: '事件类型',
    field: 'event',
    input: {
      type: 'select',
      options: IOGLOD_EVENT_TYPE_OPTIONS,
    },
  },
  {
    headerName: '保证金变化 (¥)',
    field: 'marginChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '现金变化 (¥)',
    field: 'cashChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '存续期权利金变化 (¥)',
    field: 'premiumChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '已用授信变化 (¥)',
    field: 'creditUsedChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '负债变化 (¥)',
    field: 'debtChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '出入金总额变化 (¥)',
    field: 'netDepositChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '已实现盈亏变化 (¥)',
    field: 'realizedPnLChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '授信总额变化 (¥)',
    field: 'creditChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '我方授信总额变化 (¥)',
    field: 'counterPartyCreditChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '我方剩余授信余额变化 (¥)',
    field: 'counterPartyCreditBalanceChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '我方可用资金变化 (¥)',
    field: 'counterPartyFundChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '我方冻结保证金变化 (¥)',
    field: 'counterPartyMarginChange',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '账户信息',
    field: 'information',
  },
  {
    headerName: '创建时间',
    field: 'createdAt',
    input: {
      type: 'date',
      range: 'day',
      format: 'YYYY-MM-DD h:mm:ss a',
    },
  },
  {
    headerName: '更新时间',
    field: 'updatedAt',
    input: {
      type: 'date',
      range: 'day',
      format: 'YYYY-MM-DD h:mm:ss a',
    },
  },
];
