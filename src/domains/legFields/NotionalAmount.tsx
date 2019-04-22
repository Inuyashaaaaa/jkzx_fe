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
  editable: record => {
    if (legEnvIsBooking(record) || legEnvIsPricing(record)) {
      return false;
    }
    return true;
  },
  title: '名义本金',
  dataIndex: LEG_FIELD.NOTIONAL_AMOUNT,
  render: (val, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <UnitInputNumber
            autoSelect={!(isBooking || isPricing)}
            editing={isBooking || isPricing ? true : editing}
            {...getProps(record)}
          />
        )}
      </FormItem>
    );
  },
};
