import { RULES_REQUIRED } from '@/constants/common';
import { TRADESCOLDEFS_LEG_FIELD_MAP } from '@/constants/global';
import { TRADE_HEADER_CELL_STYLE } from '@/constants/legs';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { legEnvIsPricing } from '@/tools';

export const UnderlyerPrice: ILegColDef = {
  editable: record => {
    return false;
  },
  title: '标的物价格',
  onHeaderCell: () => {
    return {
      style: TRADE_HEADER_CELL_STYLE,
    };
  },
  dataIndex: TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE,
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<UnitInputNumber editing={false} autoSelect={true} />)}
      </FormItem>
    );
  },
};
