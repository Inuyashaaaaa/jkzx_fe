import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  OBSERVATION_TYPE_MAP,
  OBSERVATION_TYPE_OPTIONS,
} from '@/constants/common';
import { Form2, Select } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

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
  defaultEditing: record => false,
  render: (val, record, index, { form, editing, colDef }) => {
    const getDefaultOpen = () => editing;

    const SPECIAL_OBSERVATION_TYPE_OPTIONS = _.reject(
      OBSERVATION_TYPE_OPTIONS,
      item => item.value === OBSERVATION_TYPE_MAP.DAILY,
    );

    const getOptions = () => {
      if (Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.BARRIER) {
        return SPECIAL_OBSERVATION_TYPE_OPTIONS;
      }
      if (Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.DOUBLE_SHARK_FIN) {
        return _.reject(
          SPECIAL_OBSERVATION_TYPE_OPTIONS,
          item => item.value === OBSERVATION_TYPE_MAP.DISCRETE,
        );
      }
      return OBSERVATION_TYPE_OPTIONS;
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<Select defaultOpen={getDefaultOpen()} editing={editing} options={getOptions()} />)}
      </FormItem>
    );
  },
};
