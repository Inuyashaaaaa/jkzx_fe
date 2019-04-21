import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Select } from '@/design/components';
import { legEnvIsBooking } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const Direction: ILegColDef = {
  editable: record => {
    if (legEnvIsBooking(record)) {
      return false;
    }
    return true;
  },
  title: '买卖方向',
  dataIndex: LEG_FIELD.DIRECTION,
  render: (value, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <Select
            defaultOpen={!isBooking}
            {...{
              editing: isBooking ? true : editing,
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
