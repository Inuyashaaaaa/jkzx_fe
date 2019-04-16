import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Checkbox } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const IsAnnual: ILegColDef = {
  title: '是否年化',
  dataIndex: LEG_FIELD.IS_ANNUAL,
  editable: true,
  render: (val, record, index, { form, editing }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<Checkbox autoSelect={true} editing={editing} />)}
      </FormItem>
    );
  },
};
