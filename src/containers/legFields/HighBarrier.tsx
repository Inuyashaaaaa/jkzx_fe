import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import { ValidationRule } from 'antd/lib/form';
import {
  LEG_FIELD,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
  UNIT_ENUM_MAP,
  LEG_TYPE_MAP,
} from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Form2 } from '@/containers';

export const HighBarrier: ILegColDef = {
  title: '高障碍价',
  dataIndex: LEG_FIELD.HIGH_BARRIER,
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
      const val = Form2.getFieldValue(record[LEG_FIELD.BARRIER_TYPE]);
      if (val === UNIT_ENUM_MAP.CNY) {
        return '¥';
      }
      if (val === UNIT_ENUM_MAP.PERCENT) {
        return '%';
      }
      return '%';
    };
    const getRules = () => {
      const data = Form2.getFieldsValue(record);
      if (LEG_TYPE_MAP.DOUBLE_SHARK_FIN === record.$legType) {
        return ([
          {
            message: '必须满足条件(低障碍价 < 低行权价<= 高行权价 < 高障碍价 )',
            validator(rule, value, callback) {
              if (
                !(
                  Form2.getFieldValue(record[LEG_FIELD.LOW_BARRIER]) <
                    Form2.getFieldValue(record[LEG_FIELD.LOW_STRIKE]) &&
                  Form2.getFieldValue(record[LEG_FIELD.LOW_STRIKE]) <=
                    Form2.getFieldValue(record[LEG_FIELD.HIGH_STRIKE]) &&
                  Form2.getFieldValue(record[LEG_FIELD.HIGH_STRIKE]) < value
                )
              ) {
                return callback(true);
              }
              return callback();
            },
          },
        ] as ValidationRule[]).concat(getRequiredRule());
      }
      const higher = [
        LEG_TYPE_MAP.DOUBLE_TOUCH,
        LEG_TYPE_MAP.DOUBLE_NO_TOUCH,
        LEG_TYPE_MAP.CONCAVA,
        LEG_TYPE_MAP.CONVEX,
        LEG_TYPE_MAP.RANGE_ACCRUALS,
      ];
      if (higher.indexOf(record.$legType) >= 0) {
        return ([
          {
            message: '必须满足条件(高障碍价 > 低障碍价)',
            validator(rule, value, callback) {
              if (!(data[LEG_FIELD.LOW_BARRIER] < value)) {
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
