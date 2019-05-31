import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
} from '@/constants/common';
import { Select, Form2 } from '@/containers';
import { legEnvIsBooking, legEnvIsPricing, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React, { PureComponent } from 'react';

const getSelectProps = record => {
  if (
    record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER ||
    record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.EAGLE
  ) {
    return {
      options: [
        {
          label: '人民币',
          value: STRIKE_TYPES_MAP.CNY,
        },
        {
          label: '百分比',
          value: STRIKE_TYPES_MAP.PERCENT,
        },
        // {
        //   label: '美元',
        //   value: STRIKE_TYPES_MAP.USD,
        // },
      ],
    };
  }

  return {
    options: [
      {
        label: '人民币',
        value: STRIKE_TYPES_MAP.CNY,
      },
      {
        label: '百分比',
        value: STRIKE_TYPES_MAP.PERCENT,
      },
    ],
  };
};

export const StrikeType: ILegColDef = {
  title: '行权价类型',
  dataIndex: LEG_FIELD.STRIKE_TYPE,
  editable: record => {
    if (Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.SPREAD_EUROPEAN) {
      return false;
    }
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  defaultEditing: false,
  render: (val, record, idnex, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(
          <Select
            {...getSelectProps(record)}
            defaultOpen={true}
            editing={isBooking || isPricing ? editing : false}
          />
        )}
      </FormItem>
    );
  },
};
