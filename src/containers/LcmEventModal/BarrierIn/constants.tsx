import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  INPUT_NUMBER_PERCENTAGE_DECIMAL_CONFIG,
  UNIT_ENUM_MAP,
} from '@/constants/common';
import { IFormControl } from '@/containers/Form/types';
import { Button } from 'antd';
import React from 'react';

export const EXPIRATION_FIXED_FORM_CONTROLS: IFormControl[] = [
  {
    field: 'EXPIRE_NO_BARRIER_PREMIUM_TYPE',
    control: {
      label: '到期未敲出收益类型',
    },
    input: { disabled: true },
    decorator: {
      rules: [
        {
          required: true,
          message: '到期未敲出收益类型为必填项',
        },
      ],
    },
  },
  {
    field: 'NOTIONAL_AMOUNT',
    control: {
      label: '名义金额',
    },
    input: { ...INPUT_NUMBER_CURRENCY_CNY_CONFIG, disabled: true },
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
    field: 'MATURES',
    control: {
      label: '到期收益 (%)',
    },
    input: { ...INPUT_NUMBER_PERCENTAGE_DECIMAL_CONFIG, disabled: true },
    decorator: {
      rules: [
        {
          required: true,
          message: '到期收益 (%)为必填项',
        },
      ],
    },
  },
  {
    field: 'SETTLE_AMOUNT',
    control: {
      label: '结算金额',
    },
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
    decorator: {
      rules: [
        {
          required: true,
          message: '结算金额为必填项',
        },
      ],
    },
  },
];

export const EXPIRATION_CALL_PUT_FORM_CONTROLS: (
  premiumType,
  handleSettleAmount,
) => IFormControl[] = (premiumType, handleSettleAmount) => [
  {
    field: 'EXPIRE_NO_BARRIER_PREMIUM_TYPE',
    control: {
      label: '到期未敲出收益类型',
    },
    input: { disabled: true },
    decorator: {
      rules: [
        {
          required: true,
          message: '到期未敲出收益类型为必填项',
        },
      ],
    },
  },
  {
    field: 'NOTIONAL_AMOUNT',
    control: {
      label: '名义金额',
    },
    input: { ...INPUT_NUMBER_CURRENCY_CNY_CONFIG, disabled: true },
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
      label: '标的物结算价格',
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
    field: 'EXERCISE_PRICE',
    control: {
      label: premiumType === UNIT_ENUM_MAP.CNY ? '行权价 (￥)' : '行权价 (%)',
    },
    input: { ...INPUT_NUMBER_DIGITAL_CONFIG, disabled: true },
    decorator: {
      rules: [
        {
          required: true,
          message: '行权价为必填项',
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
          结算
        </Button>
      ),
    },
    decorator: {
      rules: [
        {
          required: true,
          message: '结算金额为必填项',
        },
      ],
    },
  },
];

export const NOTIONAL_AMOUNT = 'NOTIONAL_AMOUNT';

export const UNDERLYER_PRICE = 'UNDERLYER_PRICE';

export const SETTLE_AMOUNT = 'SETTLE_AMOUNT';

export const MATURES = 'MATURES';

export const EXPIRE_NO_BARRIER_PREMIUM_TYPE = 'EXPIRE_NO_BARRIER_PREMIUM_TYPE';

export const EXERCISE_PRICE = 'EXERCISE_PRICE';
