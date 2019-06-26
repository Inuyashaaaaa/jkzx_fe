import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Input, Select } from '@/containers';
import { mktInstrumentSearch } from '@/services/market-data-service';
import { legEnvIsBooking, legEnvIsPricing, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const ParticipationRate: ILegColDef = {
  title: '参与率',
  dataIndex: LEG_FIELD.PARTICIPATION_RATE,
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
          rules: [getRequiredRule()],
        })(
          <UnitInputNumber
            unit="%"
            autoSelect={isBooking || isPricing}
            editing={isBooking || isPricing ? editing : false}
          />
        )}
      </FormItem>
    );
  },
};
