import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
  REBATETYPE_TYPE_OPTIONS,
  OBSERVATION_TYPE_OPTIONS,
  REBATETYPE_UNIT_OPTIONS,
  REBATETYPE_UNIT_OPTIONS_MAP,
} from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2, Select } from '@/containers';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

export const Rebate: ILegColDef = {
  title: '敲出补偿',
  dataIndex: LEG_FIELD.REBATE,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    const getUnit = () => {
      if (isPricing || isBooking) {
        if (_.get(record, [LEG_FIELD.REBATE_TYPE, 'value']) === REBATETYPE_UNIT_OPTIONS_MAP.CNY) {
          return '¥';
        }
        return '%';
      }
      if (_.get(record, [LEG_FIELD.REBATE_UNIT, 'value']) === REBATETYPE_UNIT_OPTIONS_MAP.CNY) {
        return '¥';
      }
      return '%';
    };
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<UnitInputNumber autoSelect unit={getUnit()} editing={editing} />)}
      </FormItem>
    );
  },
};
