import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { DatePicker } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const ExpirationDate: ILegColDef = {
  title: '到期日',
  dataIndex: LEG_FIELD.EXPIRATION_DATE,
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
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <DatePicker
            format="YYYY-MM-DD"
            defaultOpen={isBooking || isPricing}
            editing={isBooking || isPricing ? editing : false}
          />
        )}
      </FormItem>
    );
  },
  //   getValue: {
  //     depends: [LEG_FIELD.TERM, LEG_FIELD.EFFECTIVE_DATE],
  //     value: record => {
  //       const effectiveDate = record[LEG_FIELD.EFFECTIVE_DATE];
  //       const term = record[LEG_FIELD.TERM];
  //       if (record[LEG_FIELD.TERM] !== undefined && effectiveDate !== undefined) {
  //         return getMoment(effectiveDate, true).add(term, 'days');
  //       }
  //       return record[LEG_FIELD.EXPIRATION_DATE];
  //     },
  //   },
};
