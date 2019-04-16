import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
} from '@/constants/common';
import { Select } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React, { PureComponent } from 'react';

const getSelectProps = record => {
  if (
    record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER ||
    record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.EAGLE
  ) {
    return {
      defaultOpen: true,
      options: [
        {
          label: '人民币',
          value: STRIKE_TYPES_MAP.CNY,
        },
        {
          label: '百分比',
          value: STRIKE_TYPES_MAP.PERCENT,
        },
        {
          label: '美元',
          value: STRIKE_TYPES_MAP.USD,
        },
      ],
    };
  }

  return {
    defaultOpen: true,
    options: [
      {
        label: '人民币',
        value: STRIKE_TYPES_MAP.CNY,
      },
      {
        label: '百分比',
        value: STRIKE_TYPES_MAP.PERCENT,
      },
    ],
  };
};

export const StrikeType: ILegColDef = {
  title: '行权价类型',
  editable: true,
  dataIndex: LEG_FIELD.STRIKE_TYPE,
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
