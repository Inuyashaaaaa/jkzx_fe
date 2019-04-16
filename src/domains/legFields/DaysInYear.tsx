import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const DaysInYear: ILegColDef = {
  title: '年度计息天数',
  editable: true,
  dataIndex: LEG_FIELD.DAYS_IN_YEAR,
  render: (val, record, index, { form, editing }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<UnitInputNumber autoSelect={true} editing={editing} unit="天" />)}
      </FormItem>
    );
  },
};
