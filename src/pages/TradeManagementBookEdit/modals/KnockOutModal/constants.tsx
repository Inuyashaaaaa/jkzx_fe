import { INPUT_NUMBER_CURRENCY_CNY_CONFIG, INPUT_NUMBER_DATE_CONFIG } from '@/constants/common';
import { IFormControl } from '@/design/components/Form/types';

export const KNOCKOUT_FORM_CONTROLS: IFormControl[] = [
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
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
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
