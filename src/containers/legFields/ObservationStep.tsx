import {
  FREQUENCY_TYPE_MAP,
  FREQUENCY_TYPE_OPTIONS,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
} from '@/constants/common';
import { Form2, Select } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const ObservationStep: ILegColDef = {
  title: '观察频率',
  dataIndex: LEG_FIELD.OBSERVATION_STEP,
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
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    const getOptions = () => {
      if (Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.BARRIER) {
        return FREQUENCY_TYPE_OPTIONS.filter(item => {
          return item.value !== FREQUENCY_TYPE_MAP['1Y'] && item.value !== FREQUENCY_TYPE_MAP['6M'];
        });
      }
      return FREQUENCY_TYPE_OPTIONS;
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<Select defaultOpen={true} editing={editing} options={getOptions()} />)}
      </FormItem>
    );
  },
};
