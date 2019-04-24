import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  PREMIUM_TYPE_OPTIONS,
  PREMIUM_TYPE_ZHCN_MAP,
  RULES_REQUIRED,
} from '@/constants/common';
import { Select } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

const getSelectProps = record => {
  if (_.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.BARRIER) {
    return {
      options: PREMIUM_TYPE_OPTIONS,
    };
  }
  return {
    options: [
      {
        label: PREMIUM_TYPE_ZHCN_MAP.PERCENT,
        value: PREMIUM_TYPE_MAP.PERCENT,
      },
      {
        label: PREMIUM_TYPE_ZHCN_MAP.CNY,
        value: PREMIUM_TYPE_MAP.CNY,
      },
    ],
  };
};

export const PremiumType: ILegColDef = {
  title: '权利金类型',
  dataIndex: LEG_FIELD.PREMIUM_TYPE,
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  render: (val, record, idnex, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <Select
            {...getSelectProps(record)}
            defaultOpen={isBooking || isPricing}
            editing={isBooking || isPricing ? editing : false}
          />
        )}
      </FormItem>
    );
  },
};
