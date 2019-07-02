import { Button } from 'antd';
import React from 'react';
import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DATE_CONFIG,
  INPUT_NUMBER_LOT_CONFIG,
  NOTION_ENUM_MAP,
} from '@/constants/common';
import { IFormControl } from '@/containers/Form/types';

export const KNOCKOUT_FORM_CONTROLS: (notionalType, handleSettleAmount) => IFormControl[] = (
  notionalType,
  handleSettleAmount,
) => [
  {
    field: 'NOTIONAL_AMOUNT',
    control: {
      label: notionalType === NOTION_ENUM_MAP.CNY ? '名义本金 (￥)' : '名义本金 (手)',
    },
    input: {
      ...(notionalType === NOTION_ENUM_MAP.CNY
        ? INPUT_NUMBER_CURRENCY_CNY_CONFIG
        : INPUT_NUMBER_LOT_CONFIG),
      disabled: true,
    },
    decorator: {
      rules: [
        {
          required: true,
          message: '名义金额为必填项',
        },
      ],
    },
  },
  {
    field: 'UNDERLYER_PRICE',
    control: {
      label: '标的物价格',
    },
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
    decorator: {
      rules: [
        {
          required: true,
          message: '标的物结算价格为必填项',
        },
      ],
    },
  },
  {
    field: 'KNOCK_OUT_DATE',
    control: {
      label: '敲出日期',
    },
    input: INPUT_NUMBER_DATE_CONFIG,
    decorator: {
      rules: [
        {
          required: true,
          message: '敲出日期为必填项',
        },
      ],
    },
  },
  {
    field: 'SETTLE_AMOUNT',
    control: {
      label: '结算金额',
    },
    input: {
      ...INPUT_NUMBER_CURRENCY_CNY_CONFIG,
      after: (
        <Button key="upload" type="primary" onClick={handleSettleAmount}>
          试结算
        </Button>
      ),
    },
    decorator: {
      rules: [
        {
          required: true,
          message: '期权数量 (手)为必填项',
        },
      ],
    },
  },
];

export const NOTIONAL_AMOUNT = 'NOTIONAL_AMOUNT';

export const UNDERLYER_PRICE = 'UNDERLYER_PRICE';

export const SETTLE_AMOUNT = 'SETTLE_AMOUNT';

export const KNOCK_OUT_DATE = 'KNOCK_OUT_DATE';
