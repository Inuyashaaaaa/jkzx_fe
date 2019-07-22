import React from 'react';
import ValuationCellRenderer from './ValuationCellRenderer';
import { formatMoney } from '@/tools';

export const VALUATION_COL_DEFS = (uploading, unUploading) => [
  {
    title: '交易对手',
    dataIndex: 'legalName',
    checkboxSelection: true,
    width: 250,
    render: val => (
      <span
        style={{
          overflow: 'hidden',
          display: 'inline-block',
          wordBreak: 'break-all',
          width: '100%',
        }}
      >
        {val}
      </span>
    ),
  },
  {
    title: 'SAC协议编号',
    width: 250,
    dataIndex: 'masterAgreementId',
  },
  {
    title: '估值日',
    width: 250,
    dataIndex: 'valuationDate',
  },
  {
    title: '估值',
    width: 250,
    dataIndex: 'price',
    align: 'right',
    render: val => formatMoney(val),
  },
  {
    title: '交易邮箱',
    width: 250,
    dataIndex: 'tradeEmail',
  },
  {
    title: '操作',
    width: 250,
    render: (value, record, index) => (
      <ValuationCellRenderer params={record} uploading={uploading} unUploading={unUploading} />
    ),
  },
];
