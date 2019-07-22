import { ValidationRule } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { LEG_FIELD, RULES_REQUIRED, STRIKE_TYPES_MAP, LEG_TYPE_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

export const Strike3: ILegColDef = {
  title: '行权价3',
  dataIndex: LEG_FIELD.STRIKE3,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  render: (val, record, index, { form, editing, colDef }) => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    const getUnit = () => {
      if (Form2.getFieldValue(record[LEG_FIELD.STRIKE_TYPE]) === STRIKE_TYPES_MAP.CNY) {
        return '¥';
      }
      if (Form2.getFieldValue(record[LEG_FIELD.STRIKE_TYPE]) === STRIKE_TYPES_MAP.PERCENT) {
        return '%';
      }
      return '%';
    };

    const getRules = () => {
      if (LEG_TYPE_MAP.TRIPLE_DIGITAL === record.$legType) {
        return ([
          {
            message: '必须满足条件(行权价2 < 行权价3)',
            validator(rule, value, callback) {
              const strike3Val = value;
              const strike2Val = Form2.getFieldValue(record[LEG_FIELD.STRIKE2]);
              if (strike3Val != null && strike2Val != null) {
                if (!(strike2Val < strike3Val)) {
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
          message: '必须满足条件(行权价2 <= 行权价3)',
          validator(rule, value, callback) {
            const strike3Val = value;
            const strike2Val = Form2.getFieldValue(record[LEG_FIELD.STRIKE2]);
            if (strike3Val != null && strike2Val != null) {
              if (!(strike2Val <= strike3Val)) {
                callback(true);
              }
            }
            callback();
          },
        },
      ] as ValidationRule[]).concat(getRequiredRule());
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: getRules(),
        })(
          <UnitInputNumber
            autoSelect
            editing={isBooking || isPricing ? editing : false}
            unit={getUnit()}
          />,
        )}
      </FormItem>
    );
  },
};
