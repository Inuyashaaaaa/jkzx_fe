import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/design/components/Table/types';
import React from 'react';
import Operation from './Operation';
export const ADDRESS_CASCADER = 'ADDRESS_CASCADER';
import { CascaderOptionType } from 'antd/lib/cascader';

export const TABLE_COL_DEF: (branchSalesList, fetchTable) => IColumnDef[] = (
  branchSalesList,
  fetchTable
) => [
  {
    headerName: '销售',
    field: 'salesName',
  },
  {
    headerName: '营业部',
    field: 'subsidiaryName',
  },
  {
    headerName: '分公司',
    field: 'branchName',
  },
  {
    headerName: '创建时间',
    field: 'createdAt',
  },
  {
    headerName: '操作',
    render: params => {
      return <Operation record={params.data} fetchTable={fetchTable} />;
    },
  },
];

export const CREATE_FORM_CONTROLS: (
  branchSalesList: CascaderOptionType[]
) => IFormControl[] = branchSalesList => [
  {
    control: {
      label: '销售姓名',
    },
    field: 'salesName',
    decorator: {
      rules: [
        {
          required: true,
          message: '销售必填',
        },
      ],
    },
  },
  {
    control: {
      label: '分公司/营业部',
    },
    field: 'cascSubBranch',
    input: {
      type: 'cascader',
      options: branchSalesList,
    },
    decorator: {
      rules: [
        {
          required: true,
          message: '分公司/营业部必填',
        },
      ],
    },
  },
];
