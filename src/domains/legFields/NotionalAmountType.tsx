import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  RULES_REQUIRED,
} from '@/constants/common';
import { Select } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

export const NotionalAmountType: ILegColDef = {
  title: '名义本金类型',
  dataIndex: LEG_FIELD.NOTIONAL_AMOUNT_TYPE,
  editable: record => {
    if (_.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.AUTOCALL_ANNUAL) {
      return false;
    }

    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  render: (val, record, idnex, { form, editing, colDef }) => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <Select
            defaultOpen={isBooking || isPricing}
            editing={isBooking || isPricing ? editing : false}
            options={[
              {
                label: '手数',
                value: NOTIONAL_AMOUNT_TYPE_MAP.LOT,
              },
              {
                label: '人民币',
                value: NOTIONAL_AMOUNT_TYPE_MAP.CNY,
              },
            ]}
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
