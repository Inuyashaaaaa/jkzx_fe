import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Checkbox } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const IsAnnual: ILegColDef = {
  title: '是否年化',
  dataIndex: LEG_FIELD.IS_ANNUAL,

  render: (val, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <Checkbox
            autoSelect={!(isBooking || isPricing)}
            editing={isBooking || isPricing ? true : editing}
          />
        )}
      </FormItem>
    );
  },
};
