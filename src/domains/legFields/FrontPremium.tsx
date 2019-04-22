import { LEG_FIELD, PREMIUM_TYPE_MAP, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

const getProps = record => {
  if (_.get(record, [LEG_FIELD.PREMIUM_TYPE, 'value']) === PREMIUM_TYPE_MAP.CNY) {
    return { unit: '¥' };
  }
  return { unit: '%' };
};

export const FrontPremium: ILegColDef = {
  editable: record => {
    if (legEnvIsBooking(record) || legEnvIsPricing(record)) {
      return false;
    }
    return true;
  },
  // 权利金总和
  title: '合约期权费',
  exsitable: record => {
    if (_.get(record, [LEG_FIELD.IS_ANNUAL, 'value'])) {
      return true;
    }
    return false;
  },
  dataIndex: LEG_FIELD.FRONT_PREMIUM,
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
  //   getValue: {
  //     depends: [LEG_FIELD.PREMIUM, LEG_FIELD.MINIMUM_PREMIUM],
  //     value: record => {
  //       if (record[LEG_FIELD.PREMIUM] === undefined && record[LEG_FIELD.MINIMUM_PREMIUM]) {
  //         return undefined;
  //       }
  //       return new BigNumber(record[LEG_FIELD.PREMIUM] || 0)
  //         .plus(record[LEG_FIELD.MINIMUM_PREMIUM] || 0)
  //         .decimalPlaces(BIG_NUMBER_CONFIG.DECIMAL_PLACES)
  //         .toNumber();
  //     },
  //   },
};
