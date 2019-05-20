import { COMPUTED_LEG_FIELD_MAP } from '@/constants/global';
import { COMPUTED_HEADER_CELL_STYLE } from '@/constants/legs';
import { Input } from '@/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const Price: ILegColDef = {
  title: '价格',
  dataIndex: COMPUTED_LEG_FIELD_MAP.PRICE,
  defaultEditing: false,
  onHeaderCell: () => {
    return {
      style: COMPUTED_HEADER_CELL_STYLE,
    };
  },
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator()(
          <Input editing={false} formatter={val => (val !== undefined ? Math.abs(val) : val)} />
        )}
      </FormItem>
    );
  },
};
