import {
  LEG_FIELD,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
  UP_BARRIER_TYPE_MAP,
} from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/design/components';
import { getLegEnvs } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const CouponEarnings: ILegColDef = {
  title: '收益/coupon(%)',
  dataIndex: LEG_FIELD.COUPON_PAYMENT,
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
      return '%';
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<UnitInputNumber autoSelect={true} editing={editing} unit={getUnit()} />)}
      </FormItem>
    );
  },
};
