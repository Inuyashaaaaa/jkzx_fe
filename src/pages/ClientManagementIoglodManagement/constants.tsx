import {
  INPUT_NUMBER_DIGITAL_CONFIG,
  IOGLOD_EVENT_TYPE_OPTIONS,
  LCM_EVENT_TYPE_OPTIONS,
  PROCESS_STATUS_TYPE_OPTIONS,
} from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/design/components/Table/types';
import { trdTradeListBySimilarTradeId } from '@/services/general-service';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import React from 'react';
import CapitalInputModal from './CapitalInputModal';
import CommonCapitalInput from './CommonCapitalInput';

export const PROCESSED_FORM_CONTROLS: (tabKey) => IFormControl[] = tabKey => {
  const event = {
    control: {
      label: '事件类型',
    },
    field: 'event',
    input: {
      type: 'select',
      allowClear: true,
      placeholder: '请输入内容搜索',
      options: IOGLOD_EVENT_TYPE_OPTIONS,
    },
  };
  return ([
    {
      control: {
        label: '交易对手',
      },
      field: 'legalName',
      input: {
        type: 'select',
        showSearch: true,
        allowClear: true,
        placeholder: '请输入内容搜索',
        options: async (value: string = '') => {
          const { data, error } = await refSimilarLegalNameList({
            similarLegalName: value,
          });
          if (error) return [];
          return data.map(item => ({
            label: item,
            value: item,
          }));
        },
      },
    },
    {
      control: {
        label: '主协议编号',
      },
      field: 'masterAgreementId',
      input: {
        allowClear: true,
        type: 'select',
        showSearch: true,
        placeholder: '请输入内容搜索',
        options: async (value: string = '') => {
          const { data, error } = await refMasterAgreementSearch({
            masterAgreementId: value,
          });
          if (error) return [];
          return data.map(item => ({
            label: item,
            value: item,
          }));
        },
      },
    },
    {
      control: {
        label: '交易ID',
      },
      input: {
        type: 'select',
        showSearch: true,
        allowClear: true,
        placeholder: '请输入内容搜索',
        options: async (value: string = '') => {
          const { data, error } = await trdTradeListBySimilarTradeId({
            similarTradeId: value,
          });
          if (error) return [];
          return data.map(item => ({
            label: item,
            value: item,
          }));
        },
      },
      field: 'tradeId',
    },
  ] as any[]).concat(tabKey === 'processed' ? [] : event);
};

export const PROCESSED_COL_DEFS: (fetchTable) => IColumnDef[] = fetchTable => [
  {
    headerName: '交易对手',
    field: 'legalName',
  },
  {
    headerName: '交易ID',
    field: 'tradeId',
  },
  {
    headerName: '现金流 (¥)',
    field: 'cashFlow',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '期权费 (¥)',
    field: 'premium',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '生命周期事件',
    field: 'lcmEventType',
    input: {
      type: 'select',
      options: LCM_EVENT_TYPE_OPTIONS,
    },
  },
  {
    headerName: '操作',
    render: params => {
      return <CommonCapitalInput record={params} fetchTable={fetchTable} />;
    },
  },
];

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
