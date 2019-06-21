import { IFormControl } from '@/containers/Form/types';
import { IColumnDef } from '@/containers/Table/types';
import { trdTradeListBySimilarTradeId } from '@/services/general-service';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { trdBookListBySimilarBookName } from '@/services/trade-service';
import { Row } from 'antd';
import React from 'react';
import TradeModal from './TradeModal';

export const SEARCH_FORM_CONTROLS_TRADE: (bookIdList) => IFormControl[] = bookIdList => [
  {
    field: 'tradeDate',
    control: {
      label: '交易日',
    },
    input: {
      type: 'date',
      range: 'range',
    },
  },
  {
    field: 'docProcessStatus',
    control: {
      label: '交易确认书处理状态',
    },
    input: {
      type: 'select',
      allowClear: true,
      options: [
        {
          label: '未处理',
          value: 'UN_PROCESSED',
        },
        {
          label: '已下载',
          value: 'DOWNLOADED',
        },
        {
          label: '已发送',
          value: 'SENT',
        },
      ],
    },
  },
  {
    field: 'bookName',
    control: {
      label: '交易簿',
    },
    input: {
      type: 'select',
      allowClear: true,
      showSearch: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await trdBookListBySimilarBookName({
          similarBookName: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
  {
    field: 'tradeId',
    control: {
      label: '交易ID',
    },
    input: {
      type: 'select',
      showSearch: true,
      allowClear: true,
      placeholder: '请输入内容搜索',
      options: bookIdList.length
        ? bookIdList.map(item => {
            return {
              label: item,
              value: item,
            };
          })
        : async (value: string = '') => {
            const { data, error } = await trdTradeListBySimilarTradeId({
              similarTradeId: value,
            });
            if (error) return [];
            return data.map(item => ({
              label: item,
              value: item,
            }));
          },
    },
  },
  {
    control: {
      label: '交易对手',
    },
    input: {
      type: 'select',
      showSearch: true,
      allowClear: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await refSimilarLegalNameList({
          similarLegalName: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
    field: 'partyName',
  },
];

export const TRADE_COLUMN_DEFS: (onFetch) => IColumnDef[] = onFetch => [
  {
    field: 'tradeId',
    headerName: '交易ID',
  },
  {
    field: 'bookName',
    headerName: '交易簿',
  },
  {
    field: 'partyName',
    headerName: '交易对手',
  },
  {
    field: 'salesName',
    headerName: '销售',
  },
  {
    field: 'tradeDate',
    headerName: '交易日',
  },
  {
    field: 'tradeEmail',
    headerName: '交易邮箱',
  },
  {
    field: 'status',
    headerName: '交易确认书处理状态',
  },
  {
    headerName: '操作',
    render: params => {
      return (
        <Row type="flex" align="middle">
          <TradeModal data={params.data} onFetch={onFetch} />
        </Row>
      );
    },
  },
];
