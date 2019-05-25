import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { InputNumber } from '@/containers/Input';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const TradeNumber: ILegColDef = {
  title: '交易数量',
  dataIndex: LEG_FIELD.TRADE_NUMBER,
  editable: record => {
    return false;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator()(<InputNumber autoSelect={true} editing={false} precision={4} />)}
      </FormItem>
    );
  },
};
