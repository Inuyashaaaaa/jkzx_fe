import React from 'react';
import ValuationCellRenderer from './ValuationCellRenderer';
import { formatMoney } from '@/tools';

export const VALUATION_COL_DEFS = (uploading, unUploading) => [
  {
    title: '交易对手',
    dataIndex: 'legalName',
    checkboxSelection: true,
  },
  {
    title: 'SAC协议编号',
    dataIndex: 'masterAgreementId',
  },
  {
    title: '估值日',
    dataIndex: 'valuationDate',
  },
  {
    title: '估值',
    dataIndex: 'price',
    align: 'right',
    render: val => formatMoney(val),
  },
  {
    title: '交易邮箱',
    dataIndex: 'tradeEmail',
  },
  {
    title: '操作',
    render: (value, record, index) => {
      return (
        <ValuationCellRenderer params={record} uploading={uploading} unUploading={unUploading} />
      );
    },
  },
];
