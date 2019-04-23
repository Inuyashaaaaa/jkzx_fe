import { RULES_REQUIRED } from '@/constants/common';
import { TRADESCOLDEFS_LEG_FIELD_MAP } from '@/constants/global';
import { TRADE_HEADER_CELL_STYLE } from '@/constants/legs';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { legEnvIsPricing } from '@/tools';

export const Q: ILegColDef = {
  editable: record => {
    const isPricing = legEnvIsPricing(record);
    if (isPricing) {
      return true;
    }
    return false;
  },
  title: '分红/融券',
  dataIndex: TRADESCOLDEFS_LEG_FIELD_MAP.Q,
  onHeaderCell: () => {
    return {
      style: TRADE_HEADER_CELL_STYLE,
    };
  },
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<UnitInputNumber editing={editing} />)}
      </FormItem>
    );
  },
};
