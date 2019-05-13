import {
  LEG_FIELD,
  RULES_REQUIRED,
  UNIT_ENUM_MAP2,
  UNIT_ENUM_OPTIONS2,
  FREQUENCY_TYPE_OPTIONS,
} from '@/constants/common';
import { InputNumber, Select } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { getLegEnvs, getRequiredRule } from '@/tools';
import _ from 'lodash';

export const UpObservationStep: ILegColDef = {
  title: '敲出观察频率',
  dataIndex: LEG_FIELD.UP_OBSERVATION_STEP,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: false,
  render: (val, record, dataIndex, { form, editing, colDef }) => {
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(
          <Select
            defaultOpen={true}
            editing={editing}
            options={_.reject(FREQUENCY_TYPE_OPTIONS, item => item.value === '1D')}
          />
        )}
      </FormItem>
    );
  },
};
