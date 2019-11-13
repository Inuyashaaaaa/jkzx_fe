import React from 'react';
import formatNumber from '@/utils/format';

export const columns = sorter => [
  {
    title: '交易对手',
    dataIndex: 'partyName',
    width: 200,
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val}</span>,
  },
  {
    title: '标的物合约',
    dataIndex: 'underlyerInstrumentId',
    width: 140,
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
    render: val => <span>{val}</span>,
  },
  {
    title: 'Delta',
    dataIndex: 'delta',
    width: 200,
    sortOrder: sorter.field === 'delta' && sorter.order,
    sorter: true,
    render: value => <span>{formatNumber({ value, formatter: '0,0.00' })}</span>,
    align: 'right',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
  {
    title: 'Delta_Cash',
    dataIndex: 'deltaCash',
    width: 200,
    sortOrder: sorter.field === 'deltaCash' && sorter.order,
    sorter: true,
    render: value => <span>{formatNumber({ value, formatter: '0,0' })}</span>,
    align: 'right',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
  {
    title: 'Gamma',
    dataIndex: 'gamma',
    width: 200,
    sortOrder: sorter.field === 'gamma' && sorter.order,
    sorter: true,
    render: value => <span>{formatNumber({ value, formatter: '0,0.00' })}</span>,
    align: 'right',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
  {
    title: 'Gamma_Cash',
    dataIndex: 'gammaCash',
    width: 200,
    sortOrder: sorter.field === 'gammaCash' && sorter.order,
    sorter: true,
    render: value => <span>{formatNumber({ value, formatter: '0,0' })}</span>,
    align: 'right',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
  {
    title: 'Vega',
    dataIndex: 'vega',
    width: 200,
    sortOrder: sorter.field === 'vega' && sorter.order,
    sorter: true,
    render: value => <span>{formatNumber({ value, formatter: '0,0' })}</span>,
    align: 'right',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
  {
    title: 'Theta',
    dataIndex: 'theta',
    width: 200,
    sortOrder: sorter.field === 'theta' && sorter.order,
    sorter: true,
    render: value => <span>{formatNumber({ value, formatter: '0,0' })}</span>,
    align: 'right',
    onCell: () => ({ style: { color: 'rgba(255,120,42,1)' } }),
  },
  {
    title: 'Rho',
    dataIndex: 'rho',
    width: 200,
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
    instrumentIdPart: searchFormData.instrumentIdPart,
    partyNamePart: searchFormData.partyNamePart,
    order: ORDER_BY[sorter.order],
    orderBy: sorter.field,
  };
  return obj;
};

export const searchParams = (valuationDate, searchFormData) => {
  const obj = {
    valuationDate,
    instrumentIdPart: searchFormData.instrumentIdPart,
    partyNamePart: searchFormData.partyNamePart,
  };
  return obj;
};

export const TableTradeRivalVarieties = {
  columns,
  params,
  searchParams,
};
