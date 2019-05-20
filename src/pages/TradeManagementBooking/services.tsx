import { INPUT_NUMBER_DIGITAL_CONFIG, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Select } from '@/components';
import { IFormControl } from '@/components/Form/types';
import Input from '@/components/Input/Upload';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const ourCreateFormControls = (entrys: any = {}) => {
  const { entryMargin, entryPremium, entryCash } = entrys;
  const tradeId = {
    title: '交易ID',
    dataIndex: 'tradeId',
    render: (val, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({ rules: RULES_REQUIRED })(<Input />)}</FormItem>;
    },
  };

  const premiumlist = {
    title: '期权费',
    dataIndex: 'premium',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({ rules: RULES_REQUIRED })(<UnitInputNumber unit="¥" />)}
        </FormItem>
      );
    },
  };

  const cashFlow = {
    title: '金额',
    dataIndex: 'cashFlow',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({ rules: RULES_REQUIRED })(<UnitInputNumber unit="¥" />)}
        </FormItem>
      );
    },
  };

  const extra = [];
  if (entryMargin) {
    extra.push(tradeId);
  }
  if (entryPremium) {
    extra.push(premiumlist);
  }
  if (entryCash) {
    extra.push(cashFlow);
  }

  return [
    {
      title: '客户名称',
      dataIndex: 'legalName',
    },
    {
      title: '资金类型',
      dataIndex: 'cashType',
      render: (val, record, index, { form }) => {
        return (
          <FormItem>
            {form.getFieldDecorator({
              rules: RULES_REQUIRED,
            })(
              <Select
                {...{
                  options: [
                    {
                      label: '期权费扣除',
                      value: '期权费扣除',
                    },
                    {
                      label: '期权费收入',
                      value: '期权费收入',
                    },
                    {
                      label: '授信扣除',
                      value: '授信扣除',
                    },
                    {
                      label: '授信恢复',
                      value: '授信恢复',
                    },
                    {
                      label: '保证金冻结',
                      value: '保证金冻结',
                    },
                    {
                      label: '保证金释放',
                      value: '保证金释放',
                    },
                  ],
                }}
              />
            )}
          </FormItem>
        );
      },
    },
  ].concat(extra);
};
