import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import { LEG_FIELD, NOTIONAL_AMOUNT_TYPE_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { getRequiredRule, legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';

export const PaymentAmount: ILegColDef = {
  title: '支付金额',
  dataIndex: LEG_FIELD.PAYMENT_AMOUNT,
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [getRequiredRule()],
      })(<UnitInputNumber autoSelect editing={editing} unit="¥" />)}
    </FormItem>
  ),
};
