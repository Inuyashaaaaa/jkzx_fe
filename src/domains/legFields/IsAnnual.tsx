import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Checkbox } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const IsAnnual: ILegColDef = {
  title: '是否年化',
  dataIndex: LEG_FIELD.IS_ANNUAL,
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  render: (val, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <Checkbox
            editing={isBooking || isPricing ? editing : false}
            renderingLabels={['年化', '非年化']}
          />
        )}
      </FormItem>
    );
  },
};
