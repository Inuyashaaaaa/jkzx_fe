import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import { ValidationRule } from 'antd/lib/form';
import { LEG_FIELD, RULES_REQUIRED, STRIKE_TYPES_MAP, LEG_TYPE_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Form2 } from '@/containers';

export const HighStrike: ILegColDef = {
  title: '高行权价',
  dataIndex: LEG_FIELD.HIGH_STRIKE,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: record => false,
  render: (valData, record, index, { form, editing, colDef }) => {
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    const getUnit = () => {
      const val = Form2.getFieldValue(record[LEG_FIELD.STRIKE_TYPE]);
      if (val === STRIKE_TYPES_MAP.CNY) {
        return '¥';
      }
      if (val === STRIKE_TYPES_MAP.USD) {
        return '$';
      }
      if (val === STRIKE_TYPES_MAP.PERCENT) {
        return '%';
      }
      return '%';
    };

    const getRules = () => {
      const data = Form2.getFieldsValue(record);

      if (
        LEG_TYPE_MAP.DOUBLE_SHARK_FIN === record.$legType ||
        LEG_TYPE_MAP.STRADDLE === record.$legType
      ) {
        return ([
          {
            message: '必须满足条件(低行权价 <= 高行权价)',
            validator(rule, value, callback) {
              if (!(data[LEG_FIELD.LOW_STRIKE] <= value)) {
                return callback(true);
              }
              return callback();
            },
          },
        ] as ValidationRule[]).concat(getRequiredRule());
      }
      if (LEG_TYPE_MAP.DOUBLE_DIGITAL === record.$legType) {
        return ([
          {
            message: '必须满足条件(低行权价 < 高行权价)',
            validator(rule, value, callback) {
              if (!(data[LEG_FIELD.LOW_STRIKE] < value)) {
                return callback(true);
              }
              return callback();
            },
          },
        ] as ValidationRule[]).concat(getRequiredRule());
      }
      return [getRequiredRule()];
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          // rules: [getRequiredRule()],
          rules: getRules(),
        })(<UnitInputNumber autoSelect editing={editing} unit={getUnit()} />)}
      </FormItem>
    );
  },
};
