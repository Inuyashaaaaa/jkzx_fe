import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Select } from '@/containers';
import { legEnvIsBooking, legEnvIsPricing, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

export const PaymentState: ILegColDef = {
  title: '支付状态',
  dataIndex: LEG_FIELD.PAYMENT_STATE,
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
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
            editing={isBooking || isPricing ? editing : false}
            {...{
              options: [
                {
                  label: '未支付',
                  value: 'UNPAID',
                },
                {
                  label: '已支付',
                  value: 'PAID',
                },
              ],
            }}
          />,
        )}
      </FormItem>
    );
  },
};
