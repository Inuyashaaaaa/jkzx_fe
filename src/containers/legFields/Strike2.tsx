import { ValidationRule } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { LEG_FIELD, RULES_REQUIRED, STRIKE_TYPES_MAP, LEG_TYPE_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

const getProps = record => {
  const val = Form2.getFieldValue(record[LEG_FIELD.STRIKE_TYPE]);
  if (val === STRIKE_TYPES_MAP.CNY) {
    return { unit: '¥' };
  }
  if (val === STRIKE_TYPES_MAP.PERCENT) {
    return { unit: '%' };
  }
  return { unit: '%' };
};

export const Strike2: ILegColDef = {
  title: '行权价2',
  dataIndex: LEG_FIELD.STRIKE2,
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
      const ival = Form2.getFieldValue(record[LEG_FIELD.STRIKE_TYPE]);
      if (ival === STRIKE_TYPES_MAP.CNY) {
        return '¥';
      }
      if (ival === STRIKE_TYPES_MAP.PERCENT) {
        return '%';
      }
      return '%';
    };

    const getRules = () =>
      ([
        {
          message: '必须满足条件(行权价1 < 行权价2)',
          validator(rule, value, callback) {
            const strike2Val = value;
            const strike1Val = Form2.getFieldValue(record[LEG_FIELD.STRIKE1]);
            if (strike2Val != null && strike1Val != null) {
              if (!(strike1Val < strike2Val)) {
                callback(true);
              }
            }
            callback();
          },
        },
        LEG_TYPE_MAP.TRIPLE_DIGITAL === record.$legType
          ? {
              message: '必须满足条件(行权价2 < 行权价3)',
              validator(rule, value, callback) {
                const strike3Val = Form2.getFieldValue(record[LEG_FIELD.STRIKE3]);
                const strike2Val = value;
                if (strike3Val != null && strike2Val != null) {
                  if (!(strike2Val < strike3Val)) {
                    callback(true);
                  }
                }
                callback();
              },
            }
          : {
              message: '必须满足条件(行权价2 <= 行权价3)',
              validator(rule, value, callback) {
                const strike3Val = Form2.getFieldValue(record[LEG_FIELD.STRIKE3]);
                const strike2Val = value;
                if (strike3Val != null && strike2Val != null) {
                  if (!(strike2Val <= strike3Val)) {
                    callback(true);
                  }
                }
                callback();
              },
            },
      ] as ValidationRule[]).concat(getRequiredRule());

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
