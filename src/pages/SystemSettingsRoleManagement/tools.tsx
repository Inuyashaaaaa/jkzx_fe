import { ITableColDef } from '@/components/type';
import React from 'react';
import Operation from './Operation';

export const TABLE_COL_DEF: (fetchTable, showResource) => ITableColDef[] = (
  fetchTable,
  showResource
) => [
  {
    dataIndex: 'roleName',
    title: '角色',
  },
  {
    dataIndex: 'alias',
    title: '别名',
  },
  {
    dataIndex: 'remark',
    title: '备注',
  },
  {
    dataIndex: 'operation',
    title: '操作',
    render: (val, record, index) => {
      return <Operation data={record} fetchTable={fetchTable} showResource={showResource} />;
    },
  },
];
