import { LEG_FIELD, NOTIONAL_AMOUNT_TYPE_MAP, RULES_REQUIRED } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

const getProps = record => {
  if (_.get(record, [LEG_FIELD.NOTIONAL_AMOUNT_TYPE, 'value']) === NOTIONAL_AMOUNT_TYPE_MAP.CNY) {
    return { unit: '¥' };
  }
  return { unit: '手' };
};

export const NotionalAmount: ILegColDef = {
  editable: true,
  title: '名义本金',
  dataIndex: LEG_FIELD.NOTIONAL_AMOUNT,
  render: (val, record, index, { form, editing }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<UnitInputNumber autoSelect={true} editing={editing} {...getProps(record)} />)}
      </FormItem>
    );
  },
};
