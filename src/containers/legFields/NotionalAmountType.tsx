import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  RULES_REQUIRED,
} from '@/constants/common';
import { Select, Form2, Input } from '@/containers';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

export const NotionalAmountType: ILegColDef = {
  title: '名义本金类型',
  dataIndex: LEG_FIELD.NOTIONAL_AMOUNT_TYPE,
  editable: record => {
    if (
      Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.AUTOCALL_ANNUAL ||
      Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.SPREAD_EUROPEAN ||
      Form2.getFieldValue(record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RATIO_SPREAD_EUROPEAN) ||
      Form2.getFieldValue(record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.EAGLE)
    ) {
      return false;
    }

    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  defaultEditing: false,
  render: (val, record, idnex, { form, editing, colDef }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [getRequiredRule()],
      })(
        <Select
          defaultOpen
          editing={editing}
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
        />,
      )}
    </FormItem>
  ),
};
