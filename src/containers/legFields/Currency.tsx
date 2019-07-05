import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { LEG_FIELD, RULES_REQUIRED, UNIT_ENUM_MAP2, UNIT_ENUM_OPTIONS2 } from '@/constants/common';
import { InputNumber, Select } from '@/containers';
import { ILegColDef } from '@/types/leg';
import { getLegEnvs, getRequiredRule } from '@/tools';

export const Currency: ILegColDef = {
  title: '支付金额类型',
  dataIndex: LEG_FIELD.CURRENCY,
  editable: record => false,
  defaultEditing: false,
  render: (val, record, dataIndex, { form, editing, colDef }) => (
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    <FormItem>
      {form.getFieldDecorator({
        rules: [getRequiredRule()],
      })(<Select defaultOpen editing={false} options={UNIT_ENUM_OPTIONS2} disabled />)}
    </FormItem>
  ),
};
