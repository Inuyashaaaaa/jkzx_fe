import { IFormControl } from '@/design/components/Form/types';
import { IColumnDef } from '@/design/components/Table/types';
import { trdTradeListBySimilarTradeId } from '@/services/general-service';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { trdBookListBySimilarBookName } from '@/services/trade-service';
import React from 'react';
import SettlementModal from './SettlementModal';

export const SEARCH_FORM_CONTROLS_SETTLE: IFormControl[] = [
  {
    field: 'expirationDate',
    control: {
      label: '到期日',
    },
    input: {
      type: 'date',
      range: 'range',
    },
  },
  {
    field: 'docProcessStatus',
    control: {
      label: '结算通知书处理状态',
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
      showSearch: true,
      allowClear: true,
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
      options: async (value: string = '') => {
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
    field: 'positionId',
    control: {
      label: '持仓ID',
    },
    input: {
      type: 'select',
      showSearch: true,
      allowClear: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
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

export const SETTLE_COLUMN_DEFS: IColumnDef[] = [
  {
    field: 'positionId',
    headerName: '持仓ID',
  },
  {
    field: 'tradeId',
    headerName: '所属交易ID',
  },
  {
    field: 'bookName',
    headerName: '所属交易簿',
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
    field: 'expirationDate',
    headerName: '到期日',
  },
  {
    field: 'docProcessStatus',
    headerName: '结算通知书处理状态',
  },
  {
    headerName: '操作',
    render: params => {
      console.log(params);
      return <SettlementModal data={params.data} />;
    },
  },
];
