import { Button } from 'antd';
import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { IFormColDef } from '@/components/type';
import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DATE_CONFIG,
  INPUT_NUMBER_LOT_CONFIG,
  NOTION_ENUM_MAP,
  REBATETYPE_TYPE_OPTIONS,
} from '@/constants/common';
import { Input, DatePicker, InputNumber, Select } from '@/containers';
import { UnitInputNumber } from '@/containers/UnitInputNumber';

export const KNOCKOUT_FORM_CONTROLS: (type) => IFormColDef[] = type => [
  {
    title: '期权信息',
    dataIndex: 'information',
    render: (val, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({})(<Input editing={false} />)}</FormItem>
    ),
  },
  {
    dataIndex: 'notionalAmount',
    title: '名义本金',
    render: (val, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({})(<Input editing={false} />)}</FormItem>
    ),
  },
  {
    title: '到期日',
    dataIndex: 'expirationDate',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({})(<DatePicker editing={false} format="YYYY-MM-DD" />)}
      </FormItem>
    ),
  },
  {
    title: '补偿支付方式',
    dataIndex: 'rebateType',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({})(<Select editing={false} options={REBATETYPE_TYPE_OPTIONS} />)}
      </FormItem>
    ),
  },
  {
    dataIndex: 'knockOutDate',
    title: '敲出日期',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '敲出日期为必填项',
            },
          ],
        })(<DatePicker editing format="YYYY-MM-DD" />)}
      </FormItem>
    ),
  },
  {
    dataIndex: 'underlyerPrice',
    title: '标的物价格',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '标的物价格为必填项',
            },
          ],
        })(<UnitInputNumber unit="¥" editing />)}
      </FormItem>
    ),
  },
  {
    dataIndex: 'settleAmount',
    title: '结算金额 (￥)',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '结算金额为必填项',
            },
          ],
        })(<UnitInputNumber unit="¥" editing disabled={type} />)}
      </FormItem>
    ),
  },
  ...(type
    ? []
    : [
        {
          dataIndex: 'paymentDate',
          title: '支付日期',
          render: (val, record, index, { form, editing }) => (
            <FormItem>
              {form.getFieldDecorator({
                rules: [
                  {
                    required: true,
                    message: '支付日期为必填项',
                  },
                ],
              })(<DatePicker editing format="YYYY-MM-DD" />)}
            </FormItem>
          ),
        },
      ]),
];
