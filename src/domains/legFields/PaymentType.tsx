import { LEG_FIELD, RULES_REQUIRED, UNIT_ENUM_MAP2, UNIT_ENUM_OPTIONS2 } from '@/constants/common';
import { InputNumber, Select } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { getLegEnvs } from '@/tools';

export const PaymentType: ILegColDef = {
  title: '行权支付类型',
  dataIndex: LEG_FIELD.PAYMENT_TYPE,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  render: (val, record, dataIndex, { form, editing, colDef }) => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    const getProps = () => {
      if (isEditing) {
        return {
          defaultOpen: true,
          editing: false,
        };
      }
      return {
        defaultOpen: true,
        editing,
      };
    };
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<Select {...getProps()} options={UNIT_ENUM_OPTIONS2} />)}
      </FormItem>
    );
  },
};
