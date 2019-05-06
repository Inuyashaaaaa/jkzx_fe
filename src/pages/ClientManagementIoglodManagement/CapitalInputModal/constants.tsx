import {
  ACCOUNT_EVENT_TYPE_OPTIONS,
  DIRECTION_TYPE_OPTIONS,
  LCM_EVENT_TYPE_OPTIONS,
  RULES_REQUIRED,
} from '@/constants/common';
import { Input, InputNumber, Select } from '@/design/components';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
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
    dataIndex: 'counterPartyCredit',
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
  {
    title: '冻结保证金变化',
    dataIndex: 'marginChange',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
      );
    },
  },
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
  {
    title: '冻结保证金变化',
    dataIndex: 'counterPartyMarginChange',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<InputNumber />)}</FormItem>
      );
    },
  },
];

export const MIDDLE_FORM_CONTROLS = tradeIds => [
  {
    title: '交易编号',
    dataIndex: 'tradeId',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(
            <Select style={{ minWidth: 180 }} options={tradeIds} allowClear={true} />
          )}
        </FormItem>
      );
    },
  },
  {
    title: '资金事件类型',
    dataIndex: 'event',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({ rules: RULES_REQUIRED })(
            <Select
              style={{ minWidth: 180 }}
              options={ACCOUNT_EVENT_TYPE_OPTIONS}
              allowClear={true}
            />
          )}
        </FormItem>
      );
    },
  },
];

export const LEGAL_FORM_CONTROLS = [
  {
    title: '交易对手',
    dataIndex: 'legalName',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '交易对手是必填项',
              },
            ],
          })(
            <Select
              style={{ minWidth: 180 }}
              placeholder="请输入内容搜索"
              allowClear={true}
              fetchOptionsOnSearch={true}
              showSearch={true}
              options={async value => {
                const { data, error } = await refSimilarLegalNameList({
                  similarLegalName: value,
                });
                if (error) return [];
                return data.map(item => ({
                  label: item,
                  value: item,
                }));
              }}
            />
          )}
        </FormItem>
      );
    },
  },
  {
    title: '状态',
    dataIndex: 'normalStatus',
    render: (value, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<Input editing={false} />)}</FormItem>;
    },
  },
];
