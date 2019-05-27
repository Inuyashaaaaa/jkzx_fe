import { ACCOUNT_EVENT_TYPE_OPTIONS, RULES_REQUIRED } from '@/constants/common';
import { Input, InputNumber, Select } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

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
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
      );
    },
  },
  {
    title: '可用授信变化',
    dataIndex: 'creditBalanceChange',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
      );
    },
  },
  {
    title: '负债变化',
    dataIndex: 'debtChange',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
      );
    },
  },
  {
    title: '存续期权利金变化',
    dataIndex: 'premiumChange',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
      );
    },
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
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
      );
    },
  },
  {
    title: '可用授信变化',
    dataIndex: 'counterPartyCreditBalanceChange',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
      );
    },
  },
  {
    title: '负债变化',
    dataIndex: 'debt',
    render: (value, record, index, { form, editing }) => {
      return <FormItem>{form.getFieldDecorator({})(<InputNumber disabled={true} />)}</FormItem>;
    },
  },
  {
    title: '存续期权利金变化',
    dataIndex: 'premium',
    render: (value, record, index, { form, editing }) => {
      return <FormItem>{form.getFieldDecorator({})(<InputNumber disabled={true} />)}</FormItem>;
    },
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
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>{form.getFieldDecorator({})(<Input type="input" editing={false} />)}</FormItem>
      );
    },
  },
  {
    title: '方向',
    dataIndex: 'direction',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>{form.getFieldDecorator({})(<Input type="input" editing={false} />)}</FormItem>
      );
    },
  },
  {
    title: '生命周期事件',
    dataIndex: 'lcmEventType',
    render: (value, record, index, { form }) => {
      return (
        <FormItem wrapperCol={{ span: 16 }}>
          {form.getFieldDecorator({})(<Input type="input" editing={false} />)}
        </FormItem>
      );
    },
  },
  {
    title: '现金流',
    dataIndex: 'cashFlow',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>{form.getFieldDecorator({})(<Input type="input" editing={false} />)}</FormItem>
      );
    },
  },
  {
    title: '期权费',
    dataIndex: 'premium',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>{form.getFieldDecorator({})(<Input type="input" editing={false} />)}</FormItem>
      );
    },
  },
  {
    title: '资金事件类型',
    dataIndex: 'event',
    render: (value, record, index, { form }) => {
      return (
        <FormItem wrapperCol={{ span: 16 }}>
          {form.getFieldDecorator({})(<Select options={ACCOUNT_EVENT_TYPE_OPTIONS} />)}
        </FormItem>
      );
    },
  },
];
