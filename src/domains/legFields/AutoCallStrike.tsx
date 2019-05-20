import {
  LEG_FIELD,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
  UP_BARRIER_TYPE_MAP,
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP,
  UNIT_ENUM_MAP2,
} from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/components';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const AutoCallStrike: ILegColDef = {
  title: '到期未敲出行权价格',
  dataIndex: LEG_FIELD.AUTO_CALL_STRIKE,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: false,
  exsitable: record => {
    return (
      Form2.getFieldValue(record[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE]) ===
        EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.CALL ||
      Form2.getFieldValue(record[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE]) ===
        EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.PUT
    );
  },
  render: (val, record, index, { form, editing, colDef }) => {
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    const getUnit = () => {
      if (Form2.getFieldValue(record[LEG_FIELD.AUTO_CALL_STRIKE_UNIT]) === UNIT_ENUM_MAP2.CNY) {
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
