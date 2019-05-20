import { Form2, Select } from '@/components';
import {
  EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP,
  LEG_FIELD,
  UNIT_ENUM_OPTIONS2,
} from '@/constants/common';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const AutoCallStrikeUnit: ILegColDef = {
  title: '到期未敲出行权价类型',
  dataIndex: LEG_FIELD.AUTO_CALL_STRIKE_UNIT,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: record => {
    return false;
  },
  exsitable: record => {
    return (
      Form2.getFieldValue(record[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE]) ===
        EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.CALL ||
      Form2.getFieldValue(record[LEG_FIELD.EXPIRE_NOBARRIER_PREMIUM_TYPE]) ===
        EXPIRE_NO_BARRIER_PREMIUM_TYPE_MAP.PUT
    );
  },
  render: (val, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<Select defaultOpen={editing} editing={editing} options={UNIT_ENUM_OPTIONS2} />)}
      </FormItem>
    );
  },
};
