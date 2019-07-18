import { Button } from 'antd';
import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  NOTION_ENUM_MAP,
  LEG_TYPE_MAP,
} from '@/constants/common';
import { IFormControl } from '@/containers/Form/types';
import { DatePicker, Select } from '@/containers';
import { UnitInputNumber } from '@/containers/UnitInputNumber';

export const SETTLE_FORM_CONTROLS: (
  notionalType,
  productType,
  handleSettleAmount,
) => IFormControl[] = (notionalType, productType, handleSettleAmount) => [
  {
    field: 'NUM_OF_OPTIONS',
    control: {
      label: '期权数量 (手)',
    },
    input: { ...INPUT_NUMBER_DIGITAL_CONFIG, disabled: true },
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
      label: '名义本金 (￥)',
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
    input:
      productType === LEG_TYPE_MAP.MODEL_XY
        ? INPUT_NUMBER_CURRENCY_CNY_CONFIG
        : {
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
          message: '结算金额为必填项',
        },
      ],
    },
  },
];

export const CASHFLOW_SETTLE_FORM_CONTROLS = [
  {
    title: '支付日',
    dataIndex: 'paymentDate',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({})(<DatePicker format="YYYY-MM-DD" editing={false} />)}
      </FormItem>
    ),
  },
  {
    title: '支付金额',
    dataIndex: 'paymentAmount',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({})(<UnitInputNumber editing={false} unit="¥" />)}
      </FormItem>
    ),
  },
  {
    title: '支付方向',
    dataIndex: 'paymentDirection',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            editing={false}
            options={[{ label: '收入', value: 'RECEIVE' }, { label: '支出', value: 'PAY' }]}
          />,
        )}
      </FormItem>
    ),
  },
];

export const NUM_OF_OPTIONS = 'NUM_OF_OPTIONS';

export const NOTIONAL_AMOUNT = 'NOTIONAL_AMOUNT';

export const UNDERLYER_PRICE = 'UNDERLYER_PRICE';

export const SETTLE_AMOUNT = 'SETTLE_AMOUNT';
