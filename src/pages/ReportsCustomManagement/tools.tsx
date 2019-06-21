import Operations from './Operations';
import React from 'react';
import moment from 'moment';
import { REPORT_TYPE_MAP } from './constants';

export const TABLE_COL_DEFS = () => [
  {
    title: '报告名称',
    dataIndex: 'reportName',
    width: 150,
  },
  {
    title: '报告日期',
    dataIndex: 'valuationDate',
    width: 150,
  },
  {
    title: '报告类型',
    dataIndex: 'reportType',
    width: 150,
    render: (text, record, index) => {
      return REPORT_TYPE_MAP[text] ? REPORT_TYPE_MAP[text] : text;
    },
  },
  {
    title: '更新日期',
    dataIndex: 'updateTime',
    width: 150,
    render: (text, record, index) => {
      return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : text;
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    render: (text, record, index) => {
      return <Operations record={record} />;
    },
  },
];
