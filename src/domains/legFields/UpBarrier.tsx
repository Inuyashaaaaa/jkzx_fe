import {
  LEG_FIELD,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
  UP_BARRIER_TYPE_MAP,
} from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/design/components';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const UpBarrier: ILegColDef = {
  title: '敲出障碍价',
  dataIndex: LEG_FIELD.UP_BARRIER,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => {
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    const getUnit = () => {
      if (Form2.getFieldValue(record[LEG_FIELD.UP_BARRIER_TYPE]) === UP_BARRIER_TYPE_MAP.CNY) {
        return '¥';
      }
      return '%';
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
