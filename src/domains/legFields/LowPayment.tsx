import { LEG_FIELD, RULES_REQUIRED, STRIKE_TYPES_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/design/components';
import { getLegEnvs } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const LowPayment: ILegColDef = {
  title: '低行权收益',
  dataIndex: LEG_FIELD.LOW_PAYMENT,
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

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<UnitInputNumber {...getProps()} />)}
      </FormItem>
    );
  },
};
