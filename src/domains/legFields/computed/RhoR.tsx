import { RULES_REQUIRED } from '@/constants/common';
import { TRADESCOLDEFS_LEG_FIELD_MAP } from '@/constants/global';
import { COMPUTED_LEG_FIELD_MAP } from '@/constants/legColDefs/computedColDefs/ComputedColDefs';
import { COMPUTED_HEADER_CELL_STYLE } from '@/constants/legs';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const RhoR: ILegColDef = {
  title: 'RHO_R',
  dataIndex: COMPUTED_LEG_FIELD_MAP.RHO_R,
  onHeaderCell: () => {
    return {
      style: COMPUTED_HEADER_CELL_STYLE,
    };
  },
  render: (value, record, index, { form, editing, colDef }) => {
    return value;
  },
};
