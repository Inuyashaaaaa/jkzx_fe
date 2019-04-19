import { INPUT_NUMBER_CURRENCY_CNY_CONFIG } from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/lib/components/_Table2';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { CascaderOptionType } from 'antd/lib/cascader';
import React from 'react';
import Operations from './Operations';

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
      label: '分公司/营业部/销售',
      labelCol: { span: 11 },
      wrapperCol: { span: 13 },
    },
    input: {
      type: 'cascader',
      options: branchSalesList,
    },
    field: ADDRESS_CASCADER,
  },
  {
    control: {
      label: '状态',
    },
    input: {
      type: 'select',
      allowClear: true,
      options: [
        {
          label: '全部',
          value: 'all',
        },
        {
          label: '正常',
          value: 'normal',
        },
        {
          label: '错误',
          value: 'error',
        },
      ],
    },
    field: 'status',
  },
];

export const TABLE_COLUMN_DEFS: (handleRemove) => IColumnDef[] = handleRemove => [
  {
    headerName: '交易对手',
    field: 'legalName',
    pinned: 'left',
  },
  {
    headerName: '账户编号',
    field: 'accountId',
  },
  {
    headerName: '开户销售',
    field: 'salesName',
  },
  {
    headerName: '协议编号',
    field: 'masterAgreementId',
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
  {
    headerName: '操作',
    pinned: 'right',
    render: params => {
      console.log(params);
      return (
        <>
          <Operations record={params} handleRemove={handleRemove} />
        </>
      );
    },
  },
];
