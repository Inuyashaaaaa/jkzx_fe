/* eslint-disable */
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { ACCOUNT_EVENT_TYPE_OPTIONS, RULES_REQUIRED } from '@/constants/common';
import { Input, InputNumber, Select } from '@/containers';

export const TABLE_COL_DEF = [
  {
    title: '冻结保证金 (¥)',
    dataIndex: 'margin',
  },
  {
    title: '可用资金 (¥)',
    dataIndex: 'cash',
  },
  {
    title: '可用授信 (¥)',
    dataIndex: 'creditBalance',
  },
  {
    title: '当前负债 (¥)',
    dataIndex: 'debt',
  },
  {
    title: '我方可用授信 (¥)',
    dataIndex: 'counterPartyCreditBalance',
  },
  {
    title: '我方可用资金 (¥)',
    dataIndex: 'counterPartyFund',
  },
  {
    title: '我方保证金 (¥)',
    dataIndex: 'counterPartyMargin',
  },
];

export const PARTY_FORM_CONTROLS = [
  // 客户资金
  {
    title: '可用资金变化',
    dataIndex: 'cashChange',
    render: (value, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
    ),
  },
  {
    title: '可用授信变化',
    dataIndex: 'creditBalanceChange',
    render: (value, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
    ),
  },
  {
    title: '负债变化',
    dataIndex: 'debtChange',
    render: (value, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
    ),
  },
  {
    title: '存续期权利金变化',
    dataIndex: 'premiumChange',
    render: (value, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
    ),
  },
  // {
  //   title: '冻结保证金变化',
  //   dataIndex: 'marginChange',
  //   render: (value, record, index, { form, editing }) => {
  //     return <FormItem>{form.getFieldDecorator({})(<InputNumber  />)}</FormItem>;
  //   },
  // },
];

export const COUNTER_PARTY_FORM_CONTROLS = [
  // 我方资金
  {
    title: '可用资金变化',
    dataIndex: 'counterPartyFundChange',
    render: (value, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
    ),
  },
  {
    title: '可用授信变化',
    dataIndex: 'counterPartyCreditBalanceChange',
    render: (value, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
    ),
  },
  {
    title: '负债变化',
    dataIndex: 'debt',
    render: (value, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({})(<InputNumber disabled />)}</FormItem>
    ),
  },
  {
    title: '存续期权利金变化',
    dataIndex: 'premium',
    render: (value, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({})(<InputNumber disabled />)}</FormItem>
    ),
  },
  // {
  // title: '冻结保证金变化',
  //   dataIndex: 'counterPartyMarginChange',
  //   render: (value, record, index, { form, editing }) => {
  //     return <FormItem>{form.getFieldDecorator({})(<InputNumber  />)}</FormItem>;
  //   },
  // },
];

export const MIDDLE_FORM_CONTROLS = [
  {
    title: '交易编号',
    dataIndex: 'tradeId',
    render: (value, record, index, { form, editing }) => (
      <div data-test="data-tradeId">
        <FormItem>{form.getFieldDecorator({})(<Input type="input" editing={false} />)}</FormItem>
      </div>
    ),
  },
  {
    title: '方向',
    dataIndex: 'direction',
    render: (value, record, index, { form }) => (
      <div data-test="data-direction">
        <FormItem>{form.getFieldDecorator({})(<Input type="input" editing={false} />)}</FormItem>
      </div>
    ),
  },
  {
    title: '生命周期事件',
    dataIndex: 'lcmEventType',
    render: (value, record, index, { form }) => (
      <div data-test="data-lcmEventType">
        <FormItem wrapperCol={{ span: 16 }}>
          {form.getFieldDecorator({})(<Input type="input" editing={false} />)}
        </FormItem>
      </div>
    ),
  },
  {
    title: '现金流',
    dataIndex: 'cashFlow',
    render: (value, record, index, { form }) => (
      <div data-test="data-cashFlow">
        <FormItem>{form.getFieldDecorator({})(<Input type="input" editing={false} />)}</FormItem>
      </div>
    ),
  },
  {
    title: '期权费',
    dataIndex: 'premium',
    render: (value, record, index, { form }) => (
      <div data-test="data-premium">
        <FormItem>{form.getFieldDecorator({})(<Input type="input" editing={false} />)}</FormItem>
      </div>
    ),
  },
  {
    title: '资金事件类型',
    dataIndex: 'event',
    render: (value, record, index, { form }) => (
      <FormItem wrapperCol={{ span: 16 }}>
        {form.getFieldDecorator({})(
          <Select data-test="data-event" options={ACCOUNT_EVENT_TYPE_OPTIONS} />,
        )}
      </FormItem>
    ),
  },
];
