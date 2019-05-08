import {
  INPUT_NUMBER_DATE_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  PRODUCT_TYPE_OPTIONS,
  PRODUCTTYPE_ZHCH_MAP,
  BIG_NUMBER_CONFIG,
} from '@/constants/common';
import { inputNumberDigitalConfig } from '@/domains/inputNumberConfig';
import FormItem from 'antd/lib/form/FormItem';
import { Form2, InputNumber } from '@/design/components';
import React from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from 'antd';
import { ITableColDef } from '@/design/components/type';

export const TABLE_COL_DEFS: ITableColDef[] = [
  {
    title: '交易簿',
    dataIndex: 'bookName',
    fixed: 'left',
    width: 150,
  },
  {
    title: '交易对手',
    dataIndex: 'partyName',
    width: 150,
  },
  {
    title: '持仓编号',
    dataIndex: 'positionId',
    width: 150,
  },
  {
    title: '交易代码',
    dataIndex: 'tradeId',
    width: 150,
  },
  {
    title: '标的物代码',
    dataIndex: 'underlyerInstrumentId',
    width: 150,
  },
  {
    title: '期权类型',
    dataIndex: 'productType',
    width: 150,
    render: (value, record, index) => {
      return PRODUCTTYPE_ZHCH_MAP[value];
    },
  },
  {
    title: '交易日',
    dataIndex: 'tradeDate',
    width: 112,
    sorter: true,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: '到期日',
    dataIndex: 'expirationDate',
    width: 120,
    sorter: true,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: '期初数量 (手)',
    dataIndex: 'initialNumber',
    width: 130,
    render: (value, record, index, { form }) =>
      inputNumberDigitalConfig(value, record, index, form),
  },
  {
    title: '平仓数量 (手)',
    dataIndex: 'unwindNumber',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: '持仓数量 (手)',
    dataIndex: 'number',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: '期权费 (¥)',
    dataIndex: 'premium',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: '平仓金额 (¥)',
    dataIndex: 'unwindAmount',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: '市值 (¥)',
    dataIndex: 'marketValue',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: '盈亏 (¥)',
    dataIndex: 'pnl',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: 'Delta (手)',
    dataIndex: 'delta',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: 'Delta Decay (手)',
    dataIndex: 'deltaDecay',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: '预期Delta (手)',
    dataIndex: 'deltaWithDecay',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: 'Gamma (手)',
    dataIndex: 'gamma',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: 'Gamma金额 (¥)',
    dataIndex: 'gammaCash',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: 'Vega/1% (¥)',
    dataIndex: 'vega',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: 'Theta/1天 (¥)',
    dataIndex: 'theta',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: 'Rho/1% (¥)',
    dataIndex: 'rho',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: '标的物价格 (¥)',
    dataIndex: 'underlyerPrice',
    // input: INPUT_NUMBER_DIGITAL_CONFIG,
    width: 130,
  },
  {
    title: '错误信息',
    dataIndex: 'message',
  },
];
