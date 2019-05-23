import { LEG_FIELD, RULES_REQUIRED, UNIT_ENUM_MAP2, UNIT_ENUM_OPTIONS2 } from '@/constants/common';
import { InputNumber, Select } from '@/containers';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { getLegEnvs, getRequiredRule } from '@/tools';

export const DownBarrierOptionsStrikeType: ILegColDef = {
  title: '敲入期权行权价类型',
  dataIndex: LEG_FIELD.DOWN_BARRIER_OPTIONS_STRIKE_TYPE,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: false,
  render: (val, record, dataIndex, { form, editing, colDef }) => {
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<Select defaultOpen={true} editing={editing} options={UNIT_ENUM_OPTIONS2} />)}
      </FormItem>
    );
  },
};
