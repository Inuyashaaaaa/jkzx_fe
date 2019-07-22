import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { DatePicker, Select } from '@/containers';
import { legEnvIsBooking, legEnvIsPricing, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

export const PaymentDate: ILegColDef = {
  title: '支付日',
  dataIndex: LEG_FIELD.PAYMENT_DATE,
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [getRequiredRule()],
      })(<DatePicker format="YYYY-MM-DD" defaultOpen editing={editing} />)}
    </FormItem>
  ),
};
