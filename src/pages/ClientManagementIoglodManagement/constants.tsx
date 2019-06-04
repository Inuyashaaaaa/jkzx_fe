import {
  INPUT_NUMBER_DIGITAL_CONFIG,
  IOGLOD_EVENT_TYPE_OPTIONS,
  LCM_EVENT_TYPE_OPTIONS,
  PROCESS_STATUS_TYPE_OPTIONS,
} from '@/constants/common';
import CashInsertModal from '@/containers/CashInsertModal';
import { IFormControl } from '@/containers/Form/types';
import { IColumnDef } from '@/containers/Table/types';
import { trdTradeListBySimilarTradeId } from '@/services/general-service';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import React from 'react';
import CapitalInputModal from './CapitalInputModal';
import CommonCapitalInput from './CommonCapitalInput';
import { formatMoney } from '@/tools';
import { Select } from '@/containers';
import _ from 'lodash';
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
        fetchOptionsOnSearch: true,
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
        fetchOptionsOnSearch: true,
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
        fetchOptionsOnSearch: true,
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
      return <CashInsertModal record={params.data} fetchTable={fetchTable} />;
    },
  },
];

export const PROCESSED_COLUMN = fetchTable => [
  {
    title: '交易对手',
    width: 200,
    dataIndex: 'legalName',
  },
  {
    title: '交易ID',
    dataIndex: 'tradeId',
  },
  {
    title: '现金流 (¥)',
    width: 200,
    dataIndex: 'cashFlow',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '期权费 (¥)',
    width: 200,
    dataIndex: 'premium',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '生命周期事件',
    width: 200,
    dataIndex: 'lcmEventType',
    render: (value, record, index) => {
      return LCM_EVENT_TYPE_OPTIONS[
        _.findIndex(LCM_EVENT_TYPE_OPTIONS, item => {
          return item.value === value;
        })
      ].label;
    },
  },
  {
    title: '操作',
    width: 100,
    fixed: 'right',
    render: (text, record, index) => {
      return <CashInsertModal record={text} fetchTable={fetchTable} />;
    },
  },
];

export const HISTORY_CLOUNMS = fetchTable => [
  {
    title: '交易对手',
    dataIndex: 'legalName',
    width: 150,
    fixed: 'left',
  },
  {
    title: '交易ID',
    dataIndex: 'tradeId',
  },
  {
    title: '操作状态',
    width: 150,
    dataIndex: 'status',
    render: (value, record, index) => {
      const array = [
        {
          label: '正常',
          value: 'NORMAL',
        },
        {
          label: '错误',
          value: 'INVALID',
        },
      ];
      return array[
        _.findIndex(array, item => {
          return item.value === value;
        })
      ].label;
    },
  },
  {
    title: '事件类型',
    width: 150,
    dataIndex: 'event',
    render: (value, record, index) => {
      return IOGLOD_EVENT_TYPE_OPTIONS[
        _.findIndex(IOGLOD_EVENT_TYPE_OPTIONS, item => {
          return item.value === value;
        })
      ].label;
    },
  },
  {
    title: '保证金变化 (¥)',
    width: 150,
    dataIndex: 'marginChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '现金变化 (¥)',
    width: 150,
    dataIndex: 'cashChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '存续期权利金变化 (¥)',
    width: 200,
    dataIndex: 'premiumChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '已用授信变化 (¥)',
    width: 150,
    dataIndex: 'creditUsedChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '负债变化 (¥)',
    width: 150,
    dataIndex: 'debtChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '出入金总额变化 (¥)',
    width: 150,
    dataIndex: 'netDepositChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '已实现盈亏变化 (¥)',
    width: 200,
    dataIndex: 'realizedPnLChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '授信总额变化 (¥)',
    width: 200,
    dataIndex: 'creditChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '我方授信总额变化 (¥)',
    width: 200,
    dataIndex: 'counterPartyCreditChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '我方剩余授信余额变化 (¥)',
    width: 200,
    dataIndex: 'counterPartyCreditBalanceChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '我方可用资金变化 (¥)',
    width: 200,
    dataIndex: 'counterPartyFundChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '我方冻结保证金变化 (¥)',
    width: 200,
    dataIndex: 'counterPartyMarginChange',
    render: (text, record, index) => {
      return text ? formatMoney(text, {}) : text;
    },
  },
  {
    title: '账户信息',
    width: 250,
    dataIndex: 'information',
  },
  {
    title: '创建时间',
    width: 250,
    dataIndex: 'createdAt',
    // input: {
    //   type: 'date',
    //   range: 'day',
    //   format: 'YYYY-MM-DD h:mm:ss a',
    // },
  },
  {
    title: '更新时间',
    width: 250,
    dataIndex: 'updatedAt',
    // input: {
    //   type: 'date',
    //   range: 'day',
    //   format: 'YYYY-MM-DD h:mm:ss a',
    // },
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
