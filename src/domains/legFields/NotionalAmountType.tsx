import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  RULES_REQUIRED,
} from '@/constants/common';
import { Select, Form2 } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

export const NotionalAmountType: ILegColDef = {
  title: '名义本金类型',
  dataIndex: LEG_FIELD.NOTIONAL_AMOUNT_TYPE,
  editable: record => {
    if (Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.AUTOCALL_ANNUAL) {
      return false;
    }

    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isBooking || isPricing) {
      return true;
    }
    return false;
  },
  defaultEditing: false,
  render: (val, record, idnex, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(
          <Select
            defaultOpen={true}
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
          />
        )}
      </FormItem>
    );
  },
};
