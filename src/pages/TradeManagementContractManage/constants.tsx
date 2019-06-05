export const ROW_KEY = 'tradeId';
import {
  DIRECTION_TYPE_ZHCN_MAP,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP,
  LCM_EVENT_TYPE_OPTIONS,
  LCM_EVENT_TYPE_ZHCN_MAP,
  PRODUCTTYPE_ZHCH_MAP,
  LEG_TYPE_MAP,
} from '@/constants/common';
import { IColumnDef } from '@/containers/Table/types';
import { Timeline, Typography } from 'antd';
import React from 'react';
import Operations from './containers/CommonModel/Operations';
import styles from '@/styles/index.less';
import _ from 'lodash';

const TimelineItem = Timeline.Item;

export const BOOKING_TABLE_COLUMN_DEFS = (onSearch, name) => [
  {
    title: '交易ID',
    dataIndex: 'tradeId',
    width: 250,
    fixed: 'left',
    onCell: record => {
      return {
        style: { paddingLeft: '20px' },
      };
    },
    onHeaderCell: record => {
      return {
        style: { paddingLeft: '20px' },
      };
    },
    render: (text, record, index) => {
      if (record.timeLineNumber) {
        return (
          <span style={{ position: 'relative' }}>
            {record.tradeId}
            <Timeline
              style={{ position: 'absolute', left: '-15px', top: '5px' }}
              className={styles.timelines}
            >
              {record.positions.map((item, index) => {
                return (
                  <TimelineItem
                    style={{ paddingBottom: index === record.positions.length - 1 ? 0 : 37 }}
                    key={index}
                  />
                );
              })}
            </Timeline>
          </span>
        );
      }
      return <span>{record.tradeId}</span>;
    },
  },
  {
    title: '持仓ID',
    dataIndex: 'positionId',
    width: 250,
  },
  {
    title: '交易簿',
    dataIndex: 'bookName',
    width: 250,
  },
  {
    title: '标的物',
    dataIndex: 'underlyerInstrumentId',
    width: 100,
    render: (val, record, index) => {
      if (
        record.productType === LEG_TYPE_MAP.SPREAD_EUROPEAN ||
        record.productType === LEG_TYPE_MAP.RATIO_SPREAD_EUROPEAN
      ) {
        return _.values(
          _.pick(record.asset, ['underlyerInstrumentId1', 'underlyerInstrumentId2'])
        ).join(', ');
      }
      return record.asset.underlyerInstrumentId;
    },
  },
  {
    title: '买/卖',
    dataIndex: 'asset.direction',
    width: 100,
    render: (text, record, index) => {
      return DIRECTION_TYPE_ZHCN_MAP[text];
    },
  },
  {
    title: '期权类型',
    dataIndex: 'productType',
    width: 100,
    // width: 150,
    render: (text, record, index) => {
      return PRODUCTTYPE_ZHCH_MAP[text];
    },
  },
  {
    title: '涨/跌',
    dataIndex: 'asset.optionType',
    width: 100,
    // width: 60,
    render: (text, record, index) => {
      return EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP[text] || '--';
    },
  },
  {
    title: '交易日',
    dataIndex: 'tradeDate',
    width: 150,
  },
  {
    title: '到期日',
    dataIndex: 'asset.expirationDate',
    width: 150,
  },
  {
    title: '持仓状态',
    dataIndex: 'lcmEventType',
    width: 150,
    // width: 130,
    render: (text, record, index) => {
      return LCM_EVENT_TYPE_ZHCN_MAP[text];
    },
  },
  {
    title: '交易对手',
    dataIndex: 'counterPartyName',
    width: 150,
  },
  {
    title: '销售',
    dataIndex: 'salesName',
    width: 150,
    // width: 150,
  },
  {
    title: '所属投资组合',
    dataIndex: 'portfolioNames',
    render: (text, record, index) => {
      return text.join(', ');
    },
  },
  {
    title: '操作',
    fixed: 'right',
    dataIndex: 'action',
    width: 150,
    render: (value, record, index) => {
      return (
        <Operations name={name} record={record} onSearch={onSearch} rowId={record.positionId} />
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
];
