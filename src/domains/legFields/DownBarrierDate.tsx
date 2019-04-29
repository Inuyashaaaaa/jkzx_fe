import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { DatePicker, Select, Form2 } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const DownBarrierDate: ILegColDef = {
  title: '敲入日期',
  dataIndex: LEG_FIELD.DOWN_BARRIER_DATE,
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  exsitable: record => {
    return !!Form2.getFieldValue(record[LEG_FIELD.ALREADY_BARRIER]);
  },
  defaultEditing: false,
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <DatePicker
            defaultOpen={true}
            editing={editing}
            {...{
              format: 'YYYY-MM-DD',
            }}
          />
        )}
      </FormItem>
    );
  },
};
