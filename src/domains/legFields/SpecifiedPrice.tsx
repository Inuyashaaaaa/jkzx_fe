import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  RULES_REQUIRED,
  SPECIFIED_PRICE_MAP,
  SPECIFIED_PRICE_OPTIONS,
  SPECIFIED_PRICE_ZHCN_MAP,
} from '@/constants/common';
import { Select } from '@/components';
import { legEnvIsBooking, legEnvIsPricing, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

const getProps = record => {
  if (
    record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER ||
    record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL
  ) {
    return {
      options: SPECIFIED_PRICE_OPTIONS,
    };
  }
  return {
    options: [
      {
        label: SPECIFIED_PRICE_ZHCN_MAP.CLOSE,
        value: SPECIFIED_PRICE_MAP.CLOSE,
      },
      {
        label: SPECIFIED_PRICE_ZHCN_MAP.TWAP,
        value: SPECIFIED_PRICE_MAP.TWAP,
      },
    ],
  };
};

export const SpecifiedPrice: ILegColDef = {
  title: '结算方式',
  dataIndex: LEG_FIELD.SPECIFIED_PRICE,
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
          <Select
            {...getProps(record)}
            defaultOpen={isBooking || isPricing}
            editing={isBooking || isPricing ? editing : false}
          />
        )}
      </FormItem>
    );
  },
};
