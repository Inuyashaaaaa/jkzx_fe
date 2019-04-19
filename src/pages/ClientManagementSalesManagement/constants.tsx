import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/design/components/Table/types';
import React from 'react';
import Operation from './Operation';

export const TABLE_COL_DEF: IColumnDef[] = [
  {
    headerName: '销售',
    field: 'salesName',
  },
  {
    headerName: '营业部',
    field: 'subsidiary',
  },
  {
    headerName: '分公司',
    field: 'branch',
  },
  {
    headerName: '创建时间',
    field: 'createAt',
    input: {
      type: 'date',
      range: 'day',
      format: 'YYYY.MM.DD HH:mm:ss',
    },
  },
  {
    headerName: '操作',
    render: params => {
      return <Operation record={params.data} />;
    },
  },
];

export const CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '销售姓名',
    },
    field: 'salesName',
  },
  {
    control: {
      label: '分公司',
    },
    field: 'branch',
  },
  {
    control: {
      label: '营业部',
    },
    field: 'subsidiary',
  },
];
