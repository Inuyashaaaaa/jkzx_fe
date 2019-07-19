import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { ValidationRule } from 'antd/lib/form';
import { LEG_FIELD, STRIKE_TYPES_MAP, RULES_REQUIRED, OPTION_TYPE_MAP } from '@/constants/common';
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

    const getRules = () =>
      ([
        {
          validator(rule, value, callback) {
            const optionType = Form2.getFieldValue(record[LEG_FIELD.OPTION_TYPE]);

            if (optionType == null) {
              callback();
              return;
            }
            const payment2Val = Form2.getFieldValue(record[LEG_FIELD.PAYMENT2]);
            const payment1Val = value;
            if (Form2.getFieldValue(record[LEG_FIELD.OPTION_TYPE]) === OPTION_TYPE_MAP.CALL) {
              if (payment1Val != null && payment2Val != null) {
                if (!(payment1Val < payment2Val)) {
                  callback('必须满足条件(行权收益1 < 行权收益2)');
                }
              }
              callback();
              return;
            }
            if (payment1Val != null && payment2Val != null) {
              if (!(payment1Val > payment2Val)) {
                callback('必须满足条件(行权收益1 > 行权收益2)');
              }
            }
            callback();
          },
        },
      ] as ValidationRule[]).concat(RULES_REQUIRED);

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: getRules(),
        })(<UnitInputNumber autoSelect editing={editing} unit={getUnit()} />)}
      </FormItem>
    );
  },
};
