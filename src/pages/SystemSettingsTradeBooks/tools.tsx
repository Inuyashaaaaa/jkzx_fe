import { IColumnDef } from '@/containers/SourceTable/types';
import React from 'react';
import Operation from './Operation';

export const PAGE_TABLE_COL_DEFS: (fetchTable) => IColumnDef[] = fetchTable => [
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
  {
    headerName: '操作',
    field: 'action',
    render: params => {
      return <Operation record={params.data} fetchTable={fetchTable} />;
    },
  },
];
