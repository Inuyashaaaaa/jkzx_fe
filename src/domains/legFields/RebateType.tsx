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
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs } from '@/tools';
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
  render: (val, record, index, { form, editing, colDef }) => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    const getDefaultOpen = () => {
      if (isEditing) {
        return false;
      }
      return true;
    };

    const getEditing = () => {
      if (isEditing) {
        return false;
      }
      return editing;
    };

    const getProps = () => {
      return {
        defaultOpen: getDefaultOpen(),
        editing: getEditing(),
      };
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<Select {...getProps()} options={REBATETYPE_TYPE_OPTIONS} />)}
      </FormItem>
    );
  },
};
