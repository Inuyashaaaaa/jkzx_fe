import { Row } from 'antd';
import React from 'react';

export const columns = [
  {
    dataIndex: 'tradeId',
    title: '交易ID',
  },
  {
    dataIndex: 'bookName',
    title: '交易簿',
  },
  {
    dataIndex: 'partyName',
    title: '交易对手',
  },
  {
    dataIndex: 'salesName',
    title: '销售',
  },
  {
    dataIndex: 'tradeDate',
    title: '交易日',
  },
  {
    dataIndex: 'tradeEmail',
    title: '交易邮箱',
  },
  {
    dataIndex: 'status',
    title: '交易确认书处理状态',
  },
  {
    title: '操作',
    render: params => {
      return (
        <Row type="flex" align="middle">
          a{/* <TradeModal data={params.data} onFetch={onFetch} /> */}
        </Row>
      );
    },
  },
];
