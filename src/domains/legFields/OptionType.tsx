import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  OPTION_TYPE_OPTIONS,
  RULES_REQUIRED,
} from '@/constants/common';
import { Select } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const OptionType: ILegColDef = {
  title: '类型',
  dataIndex: LEG_FIELD.OPTION_TYPE,
  editable: record => {
    if (record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER) {
      return false;
    }
    return true;
  },
  render: (val, record, index, { form, editing }) => {
    return (
      <FormItem
        hasFeedback={true}
        help={
          record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER && editing
            ? '行权价>障碍价自动为看涨; 行权价>障碍价自动为看跌'
            : null
        }
      >
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <Select
            {...{
              defaultOpen: true,
              editing,
              type: 'select',
              options: OPTION_TYPE_OPTIONS,
            }}
          />
        )}
      </FormItem>
    );
  },
  //   getValue: params => {
  //     if (
  //       params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_ANNUAL ||
  //       params.data[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER_UNANNUAL
  //     ) {
  //       return {
  //         depends: [LEG_FIELD.BARRIER, LEG_FIELD.STRIKE],
  //         value(record) {
  //           if (record[LEG_FIELD.BARRIER] !== undefined && record[LEG_FIELD.STRIKE] !== undefined) {
  //             if (record[LEG_FIELD.BARRIER] > record[LEG_FIELD.STRIKE]) {
  //               return OPTION_TYPE_MAP.CALL;
  //             }
  //             return OPTION_TYPE_MAP.PUT;
  //           }
  //           return undefined;
  //         },
  //       };
  //     }
  //     return {
  //       depends: [],
  //       value(data) {
  //         return data[LEG_FIELD.OPTION_TYPE];
  //       },
  //     };
  //   },
};
