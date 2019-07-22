import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { LEG_FIELD, RULES_REQUIRED, STRIKE_TYPES_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

const getProps = record => {
  const val = Form2.getFieldValue(record[LEG_FIELD.STRIKE_TYPE]);
  if (val === STRIKE_TYPES_MAP.CNY) {
    return { unit: '¥' };
  }
  if (val === STRIKE_TYPES_MAP.USD) {
    return { unit: '$' };
  }
  if (val === STRIKE_TYPES_MAP.PERCENT) {
    return { unit: '%' };
  }
  return { unit: '%' };
};

export const Strike1: ILegColDef = {
  title: '行权价1',
  dataIndex: LEG_FIELD.STRIKE1,
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
      if (ival === STRIKE_TYPES_MAP.USD) {
        return '$';
      }
      if (ival === STRIKE_TYPES_MAP.PERCENT) {
        return '%';
      }
      return '%';
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              message: '必须满足条件(行权价1 < 行权价2)',
              validator(rule, value, callback) {
                const strike2Val = Form2.getFieldValue(record[LEG_FIELD.STRIKE2]);
                const strike1Val = value;
                if (strike2Val != null && strike1Val != null) {
                  if (!(strike1Val < strike2Val)) {
                    callback(true);
                  }
                }
                callback();
              },
            },
            getRequiredRule(),
          ],
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
