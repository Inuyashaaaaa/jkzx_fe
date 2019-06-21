import { ITableColDef } from '@/components/type';
import React from 'react';
import { Button, Popconfirm } from 'antd';

export const TABLE_COLUMN_DEFS: (onRemove) => ITableColDef[] = onRemove => [
  {
    title: '非交易日',
    dataIndex: 'holiday',
  },
  {
    title: '备注',
    dataIndex: 'note',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    render: (val, record, index) => {
      return (
        <Popconfirm title="确定要删除吗？" onConfirm={() => onRemove(record)}>
          <Button type="link" size="small" style={{ color: 'red' }}>
            删除
          </Button>
        </Popconfirm>
      );
    },
  },
];
