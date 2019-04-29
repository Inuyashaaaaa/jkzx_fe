import { IColumnDef } from '@/design/components/SourceTable/types';
import React from 'react';
import Operation from './Operation';

export const PAGE_TABLE_COL_DEFS: (fetchTable, showModal) => IColumnDef[] = (
  fetchTable,
  showModal
) => [
  {
    headerName: '特殊日期',
    field: 'specialDate',
  },
  {
    headerName: '权重',
    field: 'weight',
  },
  {
    headerName: '备注',
    field: 'note',
  },
  {
    headerName: '操作',
    field: 'action',
    render: params => {
      return <Operation record={params.data} fetchTable={fetchTable} showModal={showModal} />;
    },
  },
];
