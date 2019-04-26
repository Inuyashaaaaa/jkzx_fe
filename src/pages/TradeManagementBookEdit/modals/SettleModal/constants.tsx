import { INPUT_NUMBER_CURRENCY_CNY_CONFIG } from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';
import { Button } from 'antd';
import React from 'react';

export const SETTLE_FORM_CONTROLS: (productType, handleSettleAmount) => IFormControl[] = (
  productType,
  handleSettleAmount
) => [
  {
    field: 'NUM_OF_OPTIONS',
    control: {
      label: '期权数量 (手)',
    },
    input: { ...INPUT_NUMBER_CURRENCY_CNY_CONFIG, disabled: true },
    decorator: {
      rules: [
        {
          required: true,
          message: '期权数量 (手)为必填项',
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
    input: { ...INPUT_NUMBER_CURRENCY_CNY_CONFIG },
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
    field: 'SETTLE_AMOUNT',
    control: {
      label: '结算金额',
    },
    input: productType.includes('MODEL_XY')
      ? INPUT_NUMBER_CURRENCY_CNY_CONFIG
      : {
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

export const NUM_OF_OPTIONS = 'NUM_OF_OPTIONS';

export const NOTIONAL_AMOUNT = 'NOTIONAL_AMOUNT';

export const UNDERLYER_PRICE = 'UNDERLYER_PRICE';

export const SETTLE_AMOUNT = 'SETTLE_AMOUNT';
