import { LEG_FIELD, RULES_REQUIRED, STRIKE_TYPES_MAP, UNIT_ENUM_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import { Form2 } from '@/design/components';

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
  defaultEditing: record => {
    return false;
  },
  render: (val, record, index, { form, editing, colDef }) => {
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

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<UnitInputNumber autoSelect={true} editing={editing} unit={getUnit()} />)}
      </FormItem>
    );
  },
};
