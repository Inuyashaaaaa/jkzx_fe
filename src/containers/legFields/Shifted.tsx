import {
  LEG_FIELD,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
  UNIT_MAP,
  UNIT_ENUM_OPTIONS,
  UNIT_ENUM_MAP,
  UNIT_ENUM_MAP2,
} from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const BarrierShift: ILegColDef = {
  title: '等效障碍价',
  dataIndex: LEG_FIELD.BARRIER_SHIFT,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => {
    const getUnit = () => {
      if (Form2.getFieldValue(record[LEG_FIELD.BARRIER_TYPE]) === UNIT_ENUM_MAP.CNY) {
        return UNIT_MAP.ZN;
      } else {
        return UNIT_MAP.PERCENT;
      }
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<UnitInputNumber autoSelect={true} editing={editing} unit={getUnit()} />)}
      </FormItem>
    );
  },
};
