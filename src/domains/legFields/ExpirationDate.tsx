import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { DatePicker, Form2 } from '@/design/components';
import {
  legEnvIsBooking,
  legEnvIsPricing,
  legEnvIsEditing,
  getLegEnvs,
  getRequiredRule,
} from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const ExpirationDate: ILegColDef = {
  title: '到期日',
  dataIndex: LEG_FIELD.EXPIRATION_DATE,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    const isAnnual = Form2.getFieldValue(record[LEG_FIELD.IS_ANNUAL]);
    if (isPricing) {
      if (isAnnual) {
        return false;
      } else {
        return true;
      }
    }
    if (isBooking) {
      return true;
    }
    if (isEditing) {
      return false;
    }
    throw new Error('env not match!');
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<DatePicker defaultOpen={true} editing={editing} format={'YYYY-MM-DD'} />)}
      </FormItem>
    );
  },
};
