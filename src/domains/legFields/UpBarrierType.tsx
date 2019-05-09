import { LEG_FIELD, RULES_REQUIRED, UP_BARRIER_TYPE_OPTIONS } from '@/constants/common';
import { Select } from '@/design/components';
import { getLegEnvs } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const UpBarrierType: ILegColDef = {
  title: '敲出障碍价类型',
  dataIndex: LEG_FIELD.UP_BARRIER_TYPE,
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
          rules: RULES_REQUIRED,
        })(<Select defaultOpen={true} editing={editing} options={UP_BARRIER_TYPE_OPTIONS} />)}
      </FormItem>
    );
  },
};
