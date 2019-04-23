import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { DatePicker, Select } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const SettlementDate: ILegColDef = {
  title: '结算日期',
  dataIndex: LEG_FIELD.SETTLEMENT_DATE,
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
  //     depends: [LEG_FIELD.EXPIRATION_DATE],
  //     value: record => {
  //       return getMoment(record[LEG_FIELD.EXPIRATION_DATE], true);
  //     },
  //   },
};
