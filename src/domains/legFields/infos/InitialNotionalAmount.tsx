import { LEG_FIELD, RULES_REQUIRED, NOTIONAL_AMOUNT_TYPE_MAP } from '@/constants/common';
import { TRADE_HEADER_CELL_STYLE } from '@/constants/legs';
import { Input, Form2 } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { UnitInputNumber } from '@/containers/UnitInputNumber';

export const InitialNotionalAmount: ILegColDef = {
  editable: record => {
    return false;
  },
  title: '初始名义本金',
  dataIndex: LEG_FIELD.INITIAL_NOTIONAL_AMOUNT,
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
          rules: [getRequiredRule()],
        })(<UnitInputNumber editing={false} {...getProps()} />)}
      </FormItem>
    );
  },
};
