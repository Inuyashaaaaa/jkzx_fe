import { LEG_FIELD, RULES_REQUIRED, STRIKE_TYPES_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
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
  defaultEditing: record => {
    return false;
  },
  render: (val, record, index, { form, editing, colDef }) => {
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

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<UnitInputNumber autoSelect={true} editing={editing} unit={getUnit()} />)}
      </FormItem>
    );
  },
};