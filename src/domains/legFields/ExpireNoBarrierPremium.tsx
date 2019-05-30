import {
  LEG_FIELD,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
  UP_BARRIER_TYPE_MAP,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP,
} from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const ExpireNoBarrierPremium: ILegColDef = {
  title: '到期未敲出固定收益',
  dataIndex: LEG_FIELD.EXPIRE_NOBARRIERPREMIUM,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  exsitable: record => {
    return (
      Form2.getFieldValue(record[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE]) ===
      EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.FIXED
    );
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => {
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    const getUnit = () => {
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
