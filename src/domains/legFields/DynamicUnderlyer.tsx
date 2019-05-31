import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Input, Select } from '@/containers';
import {
  mktInstrumentSearch,
  mktInstrumentWhitelistListPaged,
  mktInstrumentWhitelistSearch,
} from '@/services/market-data-service';
import { legEnvIsBooking, legEnvIsPricing, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import InstrumentModalInput from '@/containers/InstrumentModalInput';

export const DynamicUnderlyer: ILegColDef = {
  title: '标的物',
  dataIndex: LEG_FIELD.DYNAMIC_UNDERLYER,
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
    editing = isBooking || isPricing ? editing : false;
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<InstrumentModalInput editing={editing} record={record} />)}
      </FormItem>
    );
  },
};
