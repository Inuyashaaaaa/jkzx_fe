import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  RULES_REQUIRED,
  SPECIFIED_PRICE_MAP,
  SPECIFIED_PRICE_OPTIONS,
  SPECIFIED_PRICE_ZHCN_MAP,
} from '@/constants/common';
import { Select } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

const getProps = record => {
  if (
    record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER ||
    record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.AUTOCALL
  ) {
    return {
      defaultOpen: true,
      options: SPECIFIED_PRICE_OPTIONS,
    };
  }
  return {
    defaultOpen: true,
    options: [
      {
        label: SPECIFIED_PRICE_ZHCN_MAP.CLOSE,
        value: SPECIFIED_PRICE_MAP.CLOSE,
      },
      {
        label: SPECIFIED_PRICE_ZHCN_MAP.TWAP,
        value: SPECIFIED_PRICE_MAP.TWAP,
      },
    ],
  };
};

export const SpecifiedPrice: ILegColDef = {
  title: '结算方式',
  editable: true,
  dataIndex: LEG_FIELD.SPECIFIED_PRICE,
  render: (val, record, index, { form, editing }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<Select {...getProps(record)} autoSelect={true} editing={editing} />)}
      </FormItem>
    );
  },
};
