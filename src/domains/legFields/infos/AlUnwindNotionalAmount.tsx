import { LEG_FIELD, RULES_REQUIRED, NOTIONAL_AMOUNT_TYPE_MAP } from '@/constants/common';
import { TRADE_HEADER_CELL_STYLE } from '@/constants/legs';
import { Input, Form2 } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { UnitInputNumber } from '@/containers/UnitInputNumber';

export const AlUnwindNotionalAmount: ILegColDef = {
  editable: record => {
    return false;
  },
  title: '已平仓名义本金',
  dataIndex: LEG_FIELD.ALUNWIND_NOTIONAL_AMOUNT,
  onHeaderCell: () => {
    return {
      style: TRADE_HEADER_CELL_STYLE,
    };
  },
  render: (value, record, index, { form, editing, colDef }) => {
    const getProps = () => {
      if (
        Form2.getFieldValue(record[LEG_FIELD.NOTIONAL_AMOUNT_TYPE]) === NOTIONAL_AMOUNT_TYPE_MAP.CNY
      ) {
        return {
          unit: '¥',
        };
      }
      return {
        unit: '手',
      };
    };
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<UnitInputNumber editing={false} {...getProps()} />)}
      </FormItem>
    );
  },
};
