import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
  REBATETYPE_TYPE_OPTIONS,
  OBSERVATION_TYPE_OPTIONS,
} from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2, Select } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

export const ObservationType: ILegColDef = {
  title: '障碍观察类型',
  dataIndex: LEG_FIELD.OBSERVATION_TYPE,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    if (
      Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.DIGITAL_AMERICAN ||
      Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.DIGITAL_EUROPEAN
    ) {
      return false;
    }
    return true;
  },
  defaultEditing: record => {
    return false;
  },
  render: (val, record, index, { form, editing, colDef }) => {
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    const getDefaultOpen = () => {
      return editing;
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(
          <Select
            defaultOpen={getDefaultOpen()}
            editing={editing}
            options={OBSERVATION_TYPE_OPTIONS}
          />
        )}
      </FormItem>
    );
  },
};
