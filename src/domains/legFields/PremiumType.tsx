import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  PREMIUM_TYPE_OPTIONS,
  PREMIUM_TYPE_ZHCN_MAP,
  RULES_REQUIRED,
} from '@/constants/common';
import { Select } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

const getSelectProps = record => {
  if (_.get(record, [LEG_TYPE_FIELD, 'value']) === LEG_TYPE_MAP.BARRIER) {
    return {
      defaultOpen: true,
      options: PREMIUM_TYPE_OPTIONS,
    };
  }
  return {
    defaultOpen: true,
    options: [
      {
        label: PREMIUM_TYPE_ZHCN_MAP.PERCENT,
        value: PREMIUM_TYPE_MAP.PERCENT,
      },
      {
        label: PREMIUM_TYPE_ZHCN_MAP.CNY,
        value: PREMIUM_TYPE_MAP.CNY,
      },
    ],
  };
};

export const PremiumType: ILegColDef = {
  editable: true,
  title: '权利金类型',
  dataIndex: LEG_FIELD.PREMIUM_TYPE,
  render: (val, record, idnex, { form, editing }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<Select {...getSelectProps(record)} editing={editing} />)}
      </FormItem>
    );
  },
};
