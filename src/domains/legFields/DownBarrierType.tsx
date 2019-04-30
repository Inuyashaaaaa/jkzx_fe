import { LEG_FIELD, RULES_REQUIRED, UNIT_ENUM_MAP2, UNIT_ENUM_OPTIONS2 } from '@/constants/common';
import { InputNumber, Select } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { getLegEnvs } from '@/tools';

export const DownBarrierType: ILegColDef = {
  title: '敲入障碍价类型',
  dataIndex: LEG_FIELD.DOWN_BARRIER_TYPE,
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
        })(<Select defaultOpen={true} editing={editing} options={UNIT_ENUM_OPTIONS2} />)}
      </FormItem>
    );
  },
};
