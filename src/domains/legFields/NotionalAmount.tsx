import { LEG_FIELD, NOTIONAL_AMOUNT_TYPE_MAP, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

const getProps = record => {
  if (_.get(record, [LEG_FIELD.NOTIONAL_AMOUNT_TYPE, 'value']) === NOTIONAL_AMOUNT_TYPE_MAP.CNY) {
    return { unit: '¥' };
  }
  return { unit: '手' };
};

export const NotionalAmount: ILegColDef = {
  title: '名义本金',
  dataIndex: LEG_FIELD.NOTIONAL_AMOUNT,
  editable: record => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  render: (val, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <UnitInputNumber
            autoSelect={isBooking || isPricing}
            editing={isBooking || isPricing ? editing : false}
            {...getProps(record)}
          />
        )}
      </FormItem>
    );
  },
};
