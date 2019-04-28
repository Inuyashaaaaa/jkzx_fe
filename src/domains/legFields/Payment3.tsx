import { LEG_FIELD, RULES_REQUIRED, STRIKE_TYPES_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/design/components';
import { getLegEnvs } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { ValidationRule } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const Payment3: ILegColDef = {
  title: '行权收益3',
  dataIndex: LEG_FIELD.PAYMENT3,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  render: (val, record, index, { form, editing, colDef }) => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    const getAutoSelect = () => {
      if (isEditing) {
        return false;
      }
      return true;
    };

    const getEditing = () => {
      if (isEditing) {
        return false;
      }
      return editing;
    };

    const getUnit = () => {
      if (Form2.getFieldValue(record[LEG_FIELD.PAYMENT_TYPE]) === STRIKE_TYPES_MAP.CNY) {
        return '¥';
      }
      return '%';
    };

    const getProps = () => {
      return { unit: getUnit(), autoSelect: getAutoSelect(), editing: getEditing() };
    };

    const getRules = () => {
      return Form2.getFieldValue(record[LEG_FIELD.OPTION_TYPE]) === 'CALL'
        ? ([
            {
              message: '必须满足条件(行权收益1<行权收益2<行权收益3)',
              validator(rule, value, callback) {
                if (
                  !(
                    Form2.getFieldValue(record[LEG_FIELD.PAYMENT1]) <
                      Form2.getFieldValue(record[LEG_FIELD.PAYMENT2]) &&
                    Form2.getFieldValue(record[LEG_FIELD.PAYMENT2]) < value
                  )
                ) {
                  return callback(true);
                }
                callback();
              },
            },
          ] as ValidationRule[]).concat(RULES_REQUIRED)
        : ([
            {
              message: '必须满足条件(行权收益1>行权收益2>行权收益3)',
              validator(rule, value, callback) {
                if (
                  !(
                    Form2.getFieldValue(record[LEG_FIELD.PAYMENT1]) >
                      Form2.getFieldValue(record[LEG_FIELD.PAYMENT2]) &&
                    Form2.getFieldValue(record[LEG_FIELD.PAYMENT2]) > value
                  )
                ) {
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
        })(<UnitInputNumber {...getProps()} />)}
      </FormItem>
    );
  },
};
