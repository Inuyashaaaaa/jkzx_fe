import { ValidationRule } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { LEG_FIELD, OPTION_TYPE_MAP, RULES_REQUIRED, STRIKE_TYPES_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

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
  defaultEditing: record => false,
  render: (val, record, index, { form, editing, colDef }) => {
    const getUnit = () => {
      if (Form2.getFieldValue(record[LEG_FIELD.PAYMENT_TYPE]) === STRIKE_TYPES_MAP.CNY) {
        return '¥';
      }
      return '%';
    };

    const getRules = () => {
      if (Form2.getFieldValue(record[LEG_FIELD.OPTION_TYPE]) === OPTION_TYPE_MAP.CALL) {
        return ([
          {
            message: '必须满足条件(行权收益1 < 行权收益2)',
            validator(rule, value, callback) {
              const optionType = Form2.getFieldValue(record[LEG_FIELD.OPTION_TYPE]);
              if (optionType == null) {
                callback();
                return;
              }
              const payment1Val = Form2.getFieldValue(record[LEG_FIELD.PAYMENT1]);
              const payment2Val = value;
              if (payment2Val != null && payment1Val != null) {
                if (!(payment1Val < payment2Val)) {
                  callback(true);
                }
              }
              callback();
            },
          },
          {
            message: '必须满足条件(行权收益2 < 行权收益3)',
            validator(rule, value, callback) {
              const optionType = Form2.getFieldValue(record[LEG_FIELD.OPTION_TYPE]);
              if (optionType == null) {
                callback();
                return;
              }
              const payment3Val = Form2.getFieldValue(record[LEG_FIELD.PAYMENT3]);
              const payment2Val = value;
              if (payment2Val != null && payment3Val != null) {
                if (!(payment2Val < payment3Val)) {
                  callback(true);
                }
              }
              callback();
            },
          },
        ] as ValidationRule[]).concat(RULES_REQUIRED);
      }
      return ([
        {
          message: '必须满足条件(行权收益1 > 行权收益2)',
          validator(rule, value, callback) {
            const optionType = Form2.getFieldValue(record[LEG_FIELD.OPTION_TYPE]);
            if (optionType == null) {
              callback();
              return;
            }
            const payment1Val = Form2.getFieldValue(record[LEG_FIELD.PAYMENT1]);
            const payment2Val = value;
            if (payment2Val != null && payment1Val != null) {
              if (!(payment1Val > payment2Val)) {
                callback(true);
              }
            }
            callback();
          },
        },
        {
          message: '必须满足条件(行权收益2 > 行权收益3)',
          validator(rule, value, callback) {
            const optionType = Form2.getFieldValue(record[LEG_FIELD.OPTION_TYPE]);
            if (optionType == null) {
              callback();
              return;
            }
            const payment3Val = Form2.getFieldValue(record[LEG_FIELD.PAYMENT3]);
            const payment2Val = value;
            if (payment2Val != null && payment3Val != null) {
              if (!(payment2Val > payment3Val)) {
                callback(true);
              }
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
        })(<UnitInputNumber autoSelect editing={editing} unit={getUnit()} />)}
      </FormItem>
    );
  },
};
