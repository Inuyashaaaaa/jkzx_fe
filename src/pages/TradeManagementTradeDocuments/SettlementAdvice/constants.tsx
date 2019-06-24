import { Row } from 'antd';
import React from 'react';

export const columns = [
  {
    dataIndex: 'positionId',
    title: '持仓ID',
  },
  {
    dataIndex: 'tradeId',
    title: '所属交易ID',
  },
  {
    dataIndex: 'bookName',
    title: '所属交易簿',
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
    dataIndex: 'expirationDate',
    title: '到期日',
  },
  {
    dataIndex: 'status',
    title: '结算通知书处理状态',
  },
  {
    title: '操作',
    render: params => {
      return (
        <Row type="flex" align="middle" style={{ height: params.node.rowHeight }}>
          ss
          {/* <SettlementModal data={params.data} onFetch={onFetch} /> */}
        </Row>
      );
    },
  },
];
