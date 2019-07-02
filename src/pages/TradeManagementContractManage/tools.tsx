import React from 'react';
import _ from 'lodash';
import { Timeline } from 'antd';
import {
  DIRECTION_TYPE_ZHCN_MAP,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP,
  LCM_EVENT_TYPE_ZHCN_MAP,
  PRODUCTTYPE_ZHCH_MAP,
  LEG_TYPE_MAP,
} from '@/constants/common';
import Operations from './containers/CommonModel/Operations';
import styles from '@/styles/index.less';

const TimelineItem = Timeline.Item;

export const BOOKING_TABLE_COLUMN_DEFS = (onSearch, name) => [
  {
    title: '交易ID',
    dataIndex: 'tradeId',
    width: 250,
    fixed: 'left',
    onCell: record => ({
      style: { paddingLeft: '20px' },
    }),
    onHeaderCell: record => ({
      style: { paddingLeft: '20px' },
    }),
    render: (text, record, index) => {
      if (record.timeLineNumber) {
        return (
          <span style={{ position: 'relative' }}>
            {record.tradeId}
            <Timeline
              style={{ position: 'absolute', left: '-15px', top: '5px' }}
              className={styles.timelines}
            >
              {record.positions.map((item, indexs) => (
                <TimelineItem
                  style={{ paddingBottom: indexs === record.positions.length - 1 ? 0 : 30.5 }}
                  key={item.positionId}
                />
              ))}
            </Timeline>
          </span>
        );
      }
      return <span>{record.tradeId}</span>;
    },
  },
  {
    title: '交易簿',
    dataIndex: 'bookName',
    width: 180,
  },
  {
    title: '标的物',
    dataIndex: 'underlyerInstrumentId',
    width: 120,
    render: (val, record, index) => {
      if (
        record.productType === LEG_TYPE_MAP.SPREAD_EUROPEAN ||
        record.productType === LEG_TYPE_MAP.RATIO_SPREAD_EUROPEAN
      ) {
        return _.values(
          _.pick(record.asset, ['underlyerInstrumentId1', 'underlyerInstrumentId2']),
        ).join(', ');
      }
      return record.asset.underlyerInstrumentId;
    },
  },
  {
    title: '买/卖',
    dataIndex: 'asset.direction',
    width: 70,
    render: (text, record, index) => DIRECTION_TYPE_ZHCN_MAP[text],
  },
  {
    title: '期权类型',
    dataIndex: 'productType',
    width: 150,
    render: (text, record, index) => PRODUCTTYPE_ZHCH_MAP[text],
  },
  {
    title: '涨/跌',
    dataIndex: 'asset.optionType',
    width: 70,
    // width: 60,
    render: (text, record, index) => EXPIRE_NO_BARRIER_PREMIUM_TYPE_ZHCN_MAP[text] || '--',
  },
  {
    title: '交易日',
    dataIndex: 'tradeDate',
    width: 120,
  },
  {
    title: '到期日',
    dataIndex: 'asset.expirationDate',
    width: 120,
  },
  {
    title: '持仓状态',
    dataIndex: 'lcmEventType',
    width: 130,
    render: (text, record, index) => LCM_EVENT_TYPE_ZHCN_MAP[text],
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
  },
  {
    title: '所属投资组合',
    dataIndex: 'portfolioNames',
    render: (text, record, index) => text.join(', '),
  },
  {
    title: '操作',
    fixed: 'right',
    dataIndex: 'action',
    width: 150,
    render: (value, record, index) => (
      <Operations name={name} record={record} onSearch={onSearch} rowId={record.positionId} />
    ),
  },
];
