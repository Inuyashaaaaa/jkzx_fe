import { LEG_FIELD, RULES_REQUIRED, STRIKE_TYPES_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/design/components';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { ValidationRule } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

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
      const val = Form2.getFieldValue(record[LEG_FIELD.STRIKE_TYPE]);
      if (val === STRIKE_TYPES_MAP.CNY) {
        return '¥';
      }
      if (val === STRIKE_TYPES_MAP.PERCENT) {
        return '%';
      }
      return '%';
    };

    const getRules = () => {
      const val = Form2.getFieldValue(record[LEG_FIELD.STRIKE1]);
      return ([
        {
          message: '必须满足条件(行权价1 < 行权价2)',
          validator(rule, value, callback) {
            if (!(Form2.getFieldValue(record[LEG_FIELD.STRIKE1]) < value)) {
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
        })(
          <UnitInputNumber
            autoSelect={true}
            editing={isBooking || isPricing ? editing : false}
            unit={getUnit()}
          />
        )}
      </FormItem>
    );
  },
};
