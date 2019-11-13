import React from 'react';
import formatNumber from '@/utils/format';

export const columns = sorter => [
  {
    title: '交易对手',
    dataIndex: 'partyName',
    width: 100,
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val}</span>,
  },
  {
    title: 'Delta_Cash',
    dataIndex: 'deltaCash',
    width: 100,
    sortOrder: sorter.field === 'deltaCash' && sorter.order,
    sorter: true,
    render: value => <span>{formatNumber({ value, formatter: '0,0' })}</span>,
    align: 'right',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
  {
    title: 'Gamma_Cash',
    dataIndex: 'gammaCash',
    width: 100,
    sortOrder: sorter.field === 'gammaCash' && sorter.order,
    sorter: true,
    render: value => <span>{formatNumber({ value, formatter: '0,0' })}</span>,
    align: 'right',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
  {
    title: 'Vega',
    dataIndex: 'vega',
    width: 100,
    sortOrder: sorter.field === 'vega' && sorter.order,
    sorter: true,
    render: value => <span>{formatNumber({ value, formatter: '0,0' })}</span>,
    align: 'right',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
  {
    title: 'Theta',
    dataIndex: 'theta',
    width: 100,
    sortOrder: sorter.field === 'theta' && sorter.order,
    sorter: true,
    render: value => <span>{formatNumber({ value, formatter: '0,0' })}</span>,
    align: 'right',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
  {
    title: 'Rho',
    dataIndex: 'rho',
    width: 100,
    sortOrder: sorter.field === 'rho' && sorter.order,
    sorter: true,
    render: value => <span>{formatNumber({ value, formatter: '0,0' })}</span>,
    align: 'right',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
];

export const params = (
  valuationDate,
  pagination: any,
  searchFormData: any,
  ORDER_BY: any,
  sorter: any,
) => {
  const obj = {
    valuationDate: valuationDate.format('YYYY-MM-DD'),
    page: 0,
    pageSize: pagination.pageSize,
    partyNamePart: searchFormData.partyNamePart,
    order: ORDER_BY[sorter.order],
    orderBy: sorter.field,
  };
  return obj;
};

export const searchParams = (valuationDate, searchFormData) => {
  const obj = {
    valuationDate,
    partyNamePart: searchFormData.partyNamePart,
  };
  return obj;
};

export const TableTradeRival = {
  columns,
  params,
  searchParams,
};
