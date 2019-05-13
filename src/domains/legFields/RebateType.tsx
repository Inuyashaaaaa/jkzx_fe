import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
  REBATETYPE_TYPE_OPTIONS,
} from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2, Select } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

export const RebateType: ILegColDef = {
  title: '补偿支付方式',
  dataIndex: LEG_FIELD.REBATE_TYPE,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: record => {
    return false;
  },
  render: (val, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<Select defaultOpen={editing} editing={editing} options={REBATETYPE_TYPE_OPTIONS} />)}
      </FormItem>
    );
  },
};
