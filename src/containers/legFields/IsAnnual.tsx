import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { LEG_FIELD, LEG_TYPE_FIELD, LEG_TYPE_MAP } from '@/constants/common';
import { Checkbox, Form2 } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

const unAnnualArray = [LEG_TYPE_MAP.FORWARD, LEG_TYPE_MAP.CASH_FLOW];

export const IsAnnual: ILegColDef = {
  title: '是否年化',
  dataIndex: LEG_FIELD.IS_ANNUAL,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    if (unAnnualArray.includes(Form2.getFieldValue(record[LEG_TYPE_FIELD]))) {
      return false;
    }

    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [getRequiredRule()],
      })(
        <Checkbox editing={editing} renderingLabels={['年化', '非年化']}>
          {val ? '年化' : '非年化'}
        </Checkbox>,
      )}
    </FormItem>
  ),
};
