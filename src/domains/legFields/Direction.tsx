import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Select } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const Direction: ILegColDef = {
  title: '买卖方向',
  dataIndex: LEG_FIELD.DIRECTION,
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
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <Select
            defaultOpen={isBooking || isPricing}
            editing={isBooking || isPricing ? editing : false}
            {...{
              options: [
                {
                  label: '买',
                  value: 'BUYER',
                },
                {
                  label: '卖',
                  value: 'SELLER',
                },
              ],
            }}
          />
        )}
      </FormItem>
    );
  },
};
