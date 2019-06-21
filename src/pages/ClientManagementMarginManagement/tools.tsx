import { INPUT_NUMBER_DIGITAL_CONFIG, MARGIN_STATUS_TYPE_OPTIONS } from '@/constants/common';
import { IColumnDef } from '@/containers/Table/types';
import React from 'react';
import Operations from './Operations';
import { formatMoney } from '@/tools';
import _ from 'lodash';

export const TABLE_COL_DEFS: (fetchTable) => IColumnDef[] = fetchTable => [
  {
    headerName: '交易对手',
    field: 'legalName',
  },
  {
    headerName: '可用资金 (¥)',
    field: 'cash',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '剩余授信额度 (¥)',
    field: 'credit',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '冻结保证金 (¥)',
    field: 'margin',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '维持保证金 (¥)',
    field: 'maintenanceMargin',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '状态',
    field: 'status',
    input: {
      type: 'select',
      options: MARGIN_STATUS_TYPE_OPTIONS,
    },
  },
  {
    headerName: '操作',
    width: 300,
    render: params => {
      return <Operations record={params.data} fetchTable={fetchTable} />;
    },
  },
];

export const TABLE_COLUMNS = fetchTable => [
  {
    title: '交易对手',
    dataIndex: 'legalName',
  },
  {
    title: '可用资金 (¥)',
    align: 'right',
    dataIndex: 'cash',
    render: (text, record, index) => {
      return formatMoney(text, {});
    },
  },
  {
    title: '剩余授信额度 (¥)',
    dataIndex: 'credit',
    align: 'right',
    render: (text, record, index) => {
      return formatMoney(text, {});
    },
  },
  {
    title: '冻结保证金 (¥)',
    align: 'right',
    dataIndex: 'margin',
    render: (text, record, index) => {
      return formatMoney(text, {});
    },
  },
  {
    title: '维持保证金 (¥)',
    align: 'right',
    dataIndex: 'maintenanceMargin',
    render: (text, record, index) => {
      return formatMoney(text, {});
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (value, record, index) => {
      return MARGIN_STATUS_TYPE_OPTIONS[
        _.findIndex(MARGIN_STATUS_TYPE_OPTIONS, item => {
          return item.value === value;
        })
      ].label;
    },
  },
  {
    title: '操作',
    width: 250,
    fixed: 'right',
    render: (text, record, index) => {
      return <Operations record={text} fetchTable={fetchTable} />;
    },
  },
];
