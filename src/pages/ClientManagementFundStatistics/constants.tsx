import { INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IFormControl } from '@/components/Form/types';
import { IColumnDef } from '@/components/_Table2';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { CascaderOptionType } from 'antd/lib/cascader';
import React from 'react';
import Operation from './Operation';

export const ADDRESS_CASCADER = 'ADDRESS_CASCADER';

export const SEARCH_FORM_CONTROLS: (
  branchSalesList: CascaderOptionType[]
) => IFormControl[] = branchSalesList => [
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
      label: '状态',
    },
    field: 'normalStatus',
    input: {
      type: 'select',
      allowClear: true,
      options: [
        { label: '全部', value: 'all' },
        {
          label: '正常',
          value: true,
        },
        {
          label: '异常',
          value: false,
        },
      ],
    },
  },
];

export const TABLE_COL_DEF: (fetchTable) => IColumnDef[] = fetchTable => [
  {
    headerName: '交易对手',
    field: 'legalName',
    pinned: 'left',
  },
  {
    headerName: '状态',
    field: 'normalStatus',
    input: {
      formatValue: value => {
        if (value) {
          return '正常';
        }
        return '错误';
      },
    },
  },
  {
    headerName: '账户信息',
    field: 'accountInformation',
  },
  {
    headerName: '保证金 (¥)',
    field: 'margin',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '现金余额 (¥)',
    field: 'cash',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '已用授信额度 (¥)',
    field: 'creditUsed',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '负债 (¥)',
    field: 'debt',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '出入金总额 (¥)',
    field: 'netDeposit',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '已实现盈亏 (¥)',
    field: 'realizedPnL',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '授信总额 (¥)',
    field: 'credit',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '我方授信总额 (¥)',
    field: 'counterPartyCredit',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '我方剩余授信余额 (¥)',
    field: 'counterPartyCreditBalance',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '我方可用资金 (¥)',
    field: 'counterPartyFund',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '我方冻结保证金 (¥)',
    field: 'counterPartyMargin',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '操作',
    pinned: 'right',
    render: params => {
      return <Operation record={params.data} fetchTable={fetchTable} />;
    },
  },
];
