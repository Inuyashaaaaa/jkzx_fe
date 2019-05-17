import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing, getRequiredRule, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { ValidationRule } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const ParticipationRate1: ILegColDef = {
  title: '参与率1',
  dataIndex: LEG_FIELD.PARTICIPATION_RATE1,
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
          rules: ([
            {
              message: '必须大于0',
              validator(rule, value, callback) {
                if (value < 0) {
                  return callback(true);
                }
                callback();
              },
            },
          ] as ValidationRule[]).concat(RULES_REQUIRED),
        })(
          <UnitInputNumber
            unit="%"
            autoSelect={true}
            editing={isBooking || isPricing ? editing : false}
          />
        )}
      </FormItem>
    );
  },
};
