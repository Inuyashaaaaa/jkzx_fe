import { BOOK_NAME_FIELD, LCM_EVENT_TYPE_OPTIONS } from '@/constants/common';
import { IFormControl } from '@/components/Form/types';
import { IColumnDef } from '@/components/Table/types';
import { trdTradeListBySimilarTradeId } from '@/services/general-service';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import {
  trdBookListBySimilarBookName,
  trdPortfolioListBySimilarPortfolioName,
} from '@/services/trade-service';
import { Button, Row } from 'antd';
import React from 'react';
import LifeModalTable from './LifeModalTable';
import PortfolioModalTable from './PortfolioModalTable';

export const ROW_KEY = 'tradeId';

export const bookingSearchFormControls: (bookList, bookIdList) => IFormControl[] = (
  bookList,
  bookIdList
) => [
  {
    control: {
      label: '交易簿',
    },
    input: {
      type: 'select',
      showSearch: true,
      placeholder: '请输入内容搜索',
      allowClear: true,
      options: async (value: string = '') => {
        const { data, error } = await trdBookListBySimilarBookName({
          similarBookName: value,
        });
        if (error) return [];
        return data
          .sort((a, b) => {
            return a.localeCompare(b);
          })
          .map(item => ({
            label: item,
            value: item,
          }));
      },
    },
    field: BOOK_NAME_FIELD,
  },
  {
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
    field: 'tradeId',
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
    field: 'counterPartyCode',
  },
  {
    control: {
      label: '销售',
    },
    input: {
      type: 'input',
      subtype: 'show',
      hoverIcon: 'lock',
    },
    field: 'salesName',
  },
  {
    control: {
      label: '交易日',
    },
    input: {
      type: 'date',
      range: 'day',
    },
    field: 'tradeDate',
  },
  {
    control: {
      label: '投资组合',
    },
    input: {
      type: 'select',
      showSearch: true,
      placeholder: '请输入内容搜索',
      mode: 'multiple',
      allowClear: true,
      options: async (value: string = '') => {
        const { data, error } = await trdPortfolioListBySimilarPortfolioName({
          similarPortfolioName: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
    field: 'portfolioNames',
  },
];

export const BOOKING_TABLE_COLUMN_DEFS2: IColumnDef[] = [
  {
    headerName: '交易ID',
    field: 'tradeId',
    width: 230,
  },
  {
    headerName: '交易簿',
    field: 'bookName',
    width: 230,
  },
  {
    headerName: '交易对手',
    field: 'commonCounterPartyName',
    width: 230,
  },
  {
    headerName: '交易日',
    field: 'tradeDate',
    width: 200,
  },
  {
    headerName: '销售',
    field: 'salesName',
    width: 230,
  },
  {
    headerName: '所属投资组合',
    field: 'portfolioNames',
    width: 300,
  },
];

export const BOOKING_TABLE_COLUMN_DEFS: (bindCheckContract, onSearch) => IColumnDef[] = (
  bindCheckContract,
  onSearch
) => [
  ...BOOKING_TABLE_COLUMN_DEFS2,
  {
    headerName: '操作',
    width: 480,
    render(params) {
      return (
        <Row type="flex" align="middle" style={{ height: params.context.rowHeight }}>
          <Button
            size="small"
            key="查看合约"
            type="primary"
            onClick={bindCheckContract(params.data)}
          >
            查看合约
          </Button>
          <LifeModalTable key="checkLife" rowData={params.data} />
          <PortfolioModalTable key="portfolio" rowData={params.data} search={onSearch} />
        </Row>
      );
    },
  },
];

export const OVERVIEW_TABLE_COLUMNDEFS: IColumnDef[] = [
  {
    headerName: '交易编号',
    field: 'tradeId',
    width: 150,
  },
  {
    headerName: '持仓编号',
    field: 'positionId',
    width: 150,
  },
  {
    headerName: '操作用户',
    field: 'userLoginId',
    width: 150,
  },
  {
    headerName: '操作时间',
    field: 'createdAt',
    width: 150,
    input: {
      type: 'date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    headerName: '生命周期事件',
    field: 'lcmEventType',
    width: 150,
    input: {
      type: 'select',
      options: LCM_EVENT_TYPE_OPTIONS,
    },
  },
  // {
  //   headerName: '交易簿',
  //   field: 'jyb',
  //   width: 150,
  //   pinned: 'left',
  // },
  // {
  //   headerName: '交易ID',
  //   field: 'id',
  //   width: 150,
  // },
  // {
  //   headerName: '交易日',
  //   field: 'jyr',
  //   width: 150,
  // },
  // {
  //   headerName: '期权类型',
  //   field: 'qqlx',
  //   width: 150,
  // },
  // {
  //   headerName: '方向',
  //   field: 'fx',
  //   width: 150,
  // },
  // {
  //   headerName: '事件',
  //   field: 'sj',
  //   width: 150,
  // },
  // {
  //   headerName: '金额（¥）',
  //   field: 'je',
  //   width: 150,
  // },
  // {
  //   headerName: '标的物',
  //   field: 'bdw',
  //   width: 150,
  // },
  // {
  //   headerName: '期初价格',
  //   field: 'qcjg',
  //   width: 150,
  // },
  // {
  //   headerName: '看涨/看跌',
  //   field: 'kzkd',
  //   width: 150,
  // },
  // {
  //   headerName: '行权价（¥）',
  //   field: 'xqj',
  //   width: 150,
  // },
  // {
  //   headerName: '行权价（%）',
  //   field: 'xqjp',
  //   width: 150,
  // },
  // {
  //   headerName: '到期日',
  //   field: 'dqr',
  //   width: 150,
  // },
  // {
  //   headerName: '到期时间',
  //   field: 'dqsj',
  //   width: 150,
  // },
  // {
  //   headerName: '合约乘数',
  //   field: 'hycs',
  //   width: 150,
  // },
  // {
  //   headerName: '期权数量',
  //   field: 'qssl',
  //   width: 150,
  // },
  // {
  //   headerName: '标的物数量',
  //   field: 'bdwsl',
  //   width: 150,
  // },
  // {
  //   headerName: '名义本金（¥）',
  //   field: 'mybj',
  //   width: 150,
  // },
  // {
  //   headerName: '名义本金（%）',
  //   field: 'mybjp',
  //   width: 150,
  // },
  // {
  //   headerName: '全单价（¥）',
  //   field: 'qdj',
  //   width: 150,
  // },
];
