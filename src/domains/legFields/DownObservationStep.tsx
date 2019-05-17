import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  NOTIONAL_AMOUNT_TYPE_MAP,
  RULES_REQUIRED,
  OPTION_TYPE_OPTIONS,
  DOWN_OBSERVATION_OPTIONS,
} from '@/constants/common';
import { Select } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

export const DownObservationStep: ILegColDef = {
  title: '敲入观察频率',
  dataIndex: LEG_FIELD.DOWN_OBSERVATION_STEP,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: false,
  render: (val, record, idnex, { form, editing, colDef }) => {
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<Select defaultOpen={true} editing={editing} options={DOWN_OBSERVATION_OPTIONS} />)}
      </FormItem>
    );
  },
};
