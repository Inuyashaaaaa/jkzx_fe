import { RULES_REQUIRED } from '@/constants/common';
import { TRADESCOLDEFS_LEG_FIELD_MAP } from '@/constants/global';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const Vol: ILegColDef = {
  editable: record => {
    return true;
  },
  title: '波动率',
  dataIndex: TRADESCOLDEFS_LEG_FIELD_MAP.VOL,
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<UnitInputNumber editing={true} />)}
      </FormItem>
    );
  },
};
