import { COMPUTED_LEG_FIELD_MAP } from '@/constants/global';
import { COMPUTED_HEADER_CELL_STYLE } from '@/constants/legs';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const Theta: ILegColDef = {
  title: 'THETA',
  dataIndex: COMPUTED_LEG_FIELD_MAP.THETA,
  onHeaderCell: () => {
    return {
      style: COMPUTED_HEADER_CELL_STYLE,
    };
  },
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>{form.getFieldDecorator()(<UnitInputNumber unit="¥" editing={false} />)}</FormItem>
    );
  },
};
