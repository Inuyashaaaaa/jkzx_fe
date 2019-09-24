import React from 'react';
import { ASSET_TYPE_ZHCN_MAP, DIRECTION_ZHCN_MAP } from '@/constants/common';
import { formatNumber, formatMoney, getMoment } from '@/tools';

export const TABLE_COL_DEFS = [
  {
    title: 'SAC协议编码',
    dataIndex: 'masterAgreementId',
    width: 130,
    fixed: 'left',
  },
  {
    title: '交易确认书编码',
    dataIndex: 'optionName',
    width: 200,
  },
  {
    title: '客户名称',
    dataIndex: 'client',
    width: 130,
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
    title: '开始日期',
    dataIndex: 'dealStartDate',
    width: 130,
    sorter: true,
    sortDirectons: ['ascend', 'descend'],
  },
  {
    title: '到期日期',
    dataIndex: 'expiry',
    width: 130,
    sorter: true,
    sortDirectons: ['ascend', 'descend'],
  },
  {
    title: '更新时间',
    dataIndex: 'createdAt',
    width: 180,
    render: (value, record, index) => (value ? getMoment(value).format('YYYY-MM-DD HH:mm:ss') : ''),
  },
  {
    title: '买卖方向',
    dataIndex: 'side',
    width: 80,
    render: (value, record, index) => DIRECTION_ZHCN_MAP[value],
  },
  {
    title: '标的资产名称',
    dataIndex: 'baseContract',
    width: 130,
  },
  {
    title: '标的资产类型',
    dataIndex: 'assetType',
    width: 130,
    render: (value, record, index) => ASSET_TYPE_ZHCN_MAP[value],
  },
  {
    title: '名义金额 (¥)',
    dataIndex: 'nominalPrice',
    width: 130,
    align: 'right',
    render: (value, record, index) => formatMoney(value),
  },
  {
    title: '期权费 (¥)',
    dataIndex: 'beginPremium',
    width: 130,
    align: 'right',
    render: (value, record, index) => formatMoney(value),
  },
  {
    title: '市值 (¥)',
    dataIndex: 'endPremium',
    width: 130,
    align: 'right',
    render: (value, record, index) => formatMoney(value),
  },
  {
    title: '总盈亏 (¥)',
    dataIndex: 'totalPremium',
    width: 130,
    align: 'right',
    render: (value, record, index) => formatMoney(value),
  },
  {
    title: '实际平仓日期',
    dataIndex: 'endDate',
    width: 130,
  },
  {
    title: '存续状态',
    dataIndex: 'status',
  },
];
