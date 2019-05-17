import { LEG_FIELD, OPTION_TYPE_MAP, RULES_REQUIRED, STRIKE_TYPES_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/design/components';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { ValidationRule } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const Payment2: ILegColDef = {
  title: '行权收益2',
  dataIndex: LEG_FIELD.PAYMENT2,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: record => {
    return false;
  },
  render: (val, record, index, { form, editing, colDef }) => {
    const getUnit = () => {
      if (Form2.getFieldValue(record[LEG_FIELD.PAYMENT_TYPE]) === STRIKE_TYPES_MAP.CNY) {
        return '¥';
      }
      return '%';
    };

    const getRules = () => {
      return Form2.getFieldValue(record[LEG_FIELD.OPTION_TYPE]) === OPTION_TYPE_MAP.CALL
        ? ([
            {
              message: '必须满足条件(行权收益1<行权收益2)',
              validator(rule, value, callback) {
                if (!(Form2.getFieldValue(record[LEG_FIELD.PAYMENT1]) < value)) {
                  return callback(true);
                }
                callback();
              },
            },
          ] as ValidationRule[]).concat(RULES_REQUIRED)
        : ([
            {
              message: '必须满足条件(行权收益1>行权收益2)',
              validator(rule, value, callback) {
                if (!(Form2.getFieldValue(record[LEG_FIELD.PAYMENT1]) > value)) {
                  return callback(true);
                }
                callback();
              },
            },
          ] as ValidationRule[]).concat(RULES_REQUIRED);
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: getRules(),
        })(<UnitInputNumber autoSelect={true} editing={editing} unit={getUnit()} />)}
      </FormItem>
    );
  },
};
