import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

export const Term: ILegColDef = {
  title: '期限',
  dataIndex: LEG_FIELD.TERM,
  editable: record => {
    if (legEnvIsBooking(record) || legEnvIsPricing(record)) {
      return false;
    }
    return true;
  },
  exsitable: record => {
    if (_.get(record, [LEG_FIELD.IS_ANNUAL, 'value'])) {
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
          <UnitInputNumber
            autoSelect={!(isBooking || isPricing)}
            editing={isBooking || isPricing ? true : editing}
            unit="天"
          />
        )}
      </FormItem>
    );
  },
};
