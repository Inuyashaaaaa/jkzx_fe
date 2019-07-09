import React from 'react';
import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  REBATETYPE_TYPE_MAP,
  REBATETYPE_TYPE_OPTIONS,
  UNIT_ENUM_OPTIONS2,
} from '@/constants/common';
import { Form2, Select } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

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
  defaultEditing: record => false,
  render: (val, record, index, { form, editing, colDef }) => {
    const SPECIAL_REBATETYPE_TYPE_OPTIONS = _.reject(
      REBATETYPE_TYPE_OPTIONS,
      item => item.value === REBATETYPE_TYPE_MAP.PAY_NONE,
    );
    // const { isPricing, isBooking } = getLegEnvs(record);
    const getSelectOptions = () => {
      if (record.$legType === LEG_TYPE_MAP.DIGITAL_AMERICAN) {
        return UNIT_ENUM_OPTIONS2;
      }
      if (
        Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.DOUBLE_SHARK_FIN ||
        Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.DIGITAL_AMERICAN
      ) {
        return SPECIAL_REBATETYPE_TYPE_OPTIONS;
      }

      return REBATETYPE_TYPE_OPTIONS;
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<Select defaultOpen={editing} editing={editing} options={getSelectOptions()} />)}
      </FormItem>
    );
  },
};
