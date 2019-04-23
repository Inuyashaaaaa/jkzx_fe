import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

export const DaysInYear: ILegColDef = {
  title: '年度计息天数',
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  exsitable: record => {
    if (_.get(record, [LEG_FIELD.IS_ANNUAL, 'value'])) {
      return true;
    }
    return false;
  },
  dataIndex: LEG_FIELD.DAYS_IN_YEAR,
  render: (val, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <UnitInputNumber
            autoSelect={isBooking || isPricing}
            editing={isBooking || isPricing ? editing : false}
            unit="天"
            precision={0}
          />
        )}
      </FormItem>
    );
  },
};
