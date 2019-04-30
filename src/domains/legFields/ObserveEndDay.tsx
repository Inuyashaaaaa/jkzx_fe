import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { DatePicker, Select } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const ObserveEndDay: ILegColDef = {
  title: '观察终止日',
  dataIndex: LEG_FIELD.OBSERVE_END_DAY,
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<DatePicker format="YYYY-MM-DD" defaultOpen={true} editing={editing} />)}
      </FormItem>
    );
  },
};
