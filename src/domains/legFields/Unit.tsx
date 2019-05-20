import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Input } from '@/components/Input';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const Unit: ILegColDef = {
  title: '报价单位',
  dataIndex: LEG_FIELD.UNIT,
  editable: record => {
    return false;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => {
    return <FormItem>{form.getFieldDecorator()(<Input editing={false} />)}</FormItem>;
  },
};
