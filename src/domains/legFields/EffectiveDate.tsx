import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { DatePicker, Select } from '@/design/components';
import { legEnvIsBooking } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const EffectiveDate: ILegColDef = {
  title: '起始日',
  editable: record => {
    if (legEnvIsBooking(record)) {
      return false;
    }
    return true;
  },
  dataIndex: LEG_FIELD.EFFECTIVE_DATE,
  render: (value, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <DatePicker
            defaultOpen={!isBooking}
            {...{
              editing: isBooking ? true : editing,
              format: 'YYYY-MM-DD',
            }}
          />
        )}
      </FormItem>
    );
  },
};
