import { IFormControl } from '@/lib/components/_Form2';
import { IColumnDef } from '@/lib/components/_Table2';
import { Icon } from 'antd';
import React from 'react';

export const PAGE_TABLE_COL_DEFS: IColumnDef[] = [
  {
    headerName: '名称',
    field: 'resourceName',
    editable: true,
  },
  {
    headerName: '部门',
    field: 'departmentName',
    editable: false,
  },
  {
    headerName: '创建时间',
    field: 'createTime',
  },
];

export const CREATE_FORM_CONTROLS: IFormControl[] = [
  {
    dataIndex: 'resourceName',
    control: {
      label: '交易簿名称',
    },
    input: {
      type: 'input',
    },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
];
