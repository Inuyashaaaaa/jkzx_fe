import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  RULES_REQUIRED,
} from '@/constants/common';
import { Select } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

const getSelectProps = record => {
  return {
    type: 'select',
    options: [
      {
        label: '手数',
        value: NOTIONAL_AMOUNT_TYPE_MAP.LOT,
      },
      {
        label: '人民币',
        value: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
      },
    ],
  };
};

export const NotionalAmountType: ILegColDef = {
  editable: record => {
    if (_.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.AUTOCALL_ANNUAL) {
      return false;
    }
    if (legEnvIsBooking(record) || legEnvIsPricing(record)) {
      return false;
    }
    return true;
  },
  title: '名义本金类型',
  dataIndex: LEG_FIELD.NOTIONAL_AMOUNT_TYPE,
  render: (val, record, idnex, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    const isPricing = legEnvIsPricing(record);

    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <Select
            {...getSelectProps(record)}
            defaultOpen={!(isBooking || isPricing)}
            editing={isBooking || isPricing ? true : editing}
          />
        )}
      </FormItem>
    );
  },
  //   getValue: params => {
  //     if (params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL_ANNUAL) {
  //       return {
  //         depends: [],
  //         value(data) {
  //           return data[LEG_FIELD.NOTIONAL_AMOUNT_TYPE];
  //         },
  //       };
  //     }
  //     return {
  //       depends: [LEG_FIELD.PREMIUM_TYPE],
  //       value(record) {
  //         if (record[LEG_FIELD.PREMIUM_TYPE] === PREMIUM_TYPE_MAP.PERCENT) {
  //           return NOTIONAL_AMOUNT_TYPE_MAP.CNY;
  //         }
  //         return NOTIONAL_AMOUNT_TYPE_MAP.LOT;
  //       },
  //     };
  //   },
};
