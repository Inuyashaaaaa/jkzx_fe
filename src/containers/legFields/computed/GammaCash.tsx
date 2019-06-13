import { COMPUTED_LEG_FIELD_MAP } from '@/constants/global';
import { COMPUTED_HEADER_CELL_STYLE } from '@/constants/legs';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const GammaCash: ILegColDef = {
  title: 'GAMMA_CASH',
  dataIndex: COMPUTED_LEG_FIELD_MAP.GAMMA_CASH,
  defaultEditing: false,
  onHeaderCell: () => {
    return {
      style: COMPUTED_HEADER_CELL_STYLE,
    };
  },
  getUnit: () => '¥',
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>{form.getFieldDecorator()(<UnitInputNumber unit="¥" editing={false} />)}</FormItem>
    );
  },
};
