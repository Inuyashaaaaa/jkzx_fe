import { LEG_FIELD, RULES_REQUIRED, LCM_EVENT_TYPE_OPTIONS } from '@/constants/common';
import { TRADE_HEADER_CELL_STYLE } from '@/constants/legs';
import { Input, Select } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const LcmEventType: ILegColDef = {
  editable: record => {
    return false;
  },
  title: '状态',
  dataIndex: LEG_FIELD.LCM_EVENT_TYPE,
  onHeaderCell: () => {
    return {
      style: TRADE_HEADER_CELL_STYLE,
    };
  },
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(<Select editing={false} options={LCM_EVENT_TYPE_OPTIONS} />)}
      </FormItem>
    );
  },
};
