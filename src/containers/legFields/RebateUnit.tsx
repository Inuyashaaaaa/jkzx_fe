import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
  REBATETYPE_TYPE_OPTIONS,
  OBSERVATION_TYPE_OPTIONS,
  REBATETYPE_UNIT_OPTIONS,
} from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2, Select } from '@/containers';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

export const RebateUnit: ILegColDef = {
  title: '敲出补偿类型',
  dataIndex: LEG_FIELD.REBATE_UNIT,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: record => false,
  render: (val, record, index, { form, editing, colDef }) => {
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    const getDefaultOpen = () => editing;

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(
          <Select
            defaultOpen={getDefaultOpen()}
            editing={editing}
            options={REBATETYPE_UNIT_OPTIONS}
          />,
        )}
      </FormItem>
    );
  },
};
