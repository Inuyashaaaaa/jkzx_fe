import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { LEG_FIELD, STRIKE_TYPES_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

export const Payment1: ILegColDef = {
  title: '行权收益1',
  dataIndex: LEG_FIELD.PAYMENT1,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: record => false,
  render: (val, record, index, { form, editing, colDef }) => {
    const getUnit = () => {
      if (Form2.getFieldValue(record[LEG_FIELD.PAYMENT_TYPE]) === STRIKE_TYPES_MAP.CNY) {
        return '¥';
      }
      return '%';
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              message: '必须满足条件(行权收益1 < 行权收益2)',
              validator(rule, value, callback) {
                const payment2Val = Form2.getFieldValue(record[LEG_FIELD.PAYMENT2]);
                const payment1Val = value;
                if (payment2Val != null && payment1Val != null) {
                  if (!(payment1Val < payment2Val)) {
                    callback(true);
                  }
                }
                callback();
              },
            },
            getRequiredRule(),
          ],
        })(<UnitInputNumber autoSelect editing={editing} unit={getUnit()} />)}
      </FormItem>
    );
  },
};
