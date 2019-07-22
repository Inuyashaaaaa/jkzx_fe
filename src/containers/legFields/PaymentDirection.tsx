import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Select } from '@/containers';
import { legEnvIsBooking, legEnvIsPricing, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

export const PaymentDirection: ILegColDef = {
  title: '支付方向',
  dataIndex: LEG_FIELD.PAYMENT_DIRECTION,
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  defaultEditing: false,
  render: (value, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(
          <Select
            defaultOpen={isBooking || isPricing}
            editing={editing}
            {...{
              options: [
                {
                  label: '支出',
                  value: 'PAY',
                },
                {
                  label: '收入',
                  value: 'RECEIVE',
                },
              ],
            }}
          />,
        )}
      </FormItem>
    );
  },
};
