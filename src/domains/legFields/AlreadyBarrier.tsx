import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Checkbox } from '@/containers';
import { legEnvIsBooking, legEnvIsPricing, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const AlreadyBarrier: ILegColDef = {
  title: '已经敲入',
  dataIndex: LEG_FIELD.ALREADY_BARRIER,
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
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<Checkbox editing={editing} renderingLabels={['已敲入', '未敲入']} />)}
      </FormItem>
    );
  },
};
