import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { LEG_FIELD, LEG_TYPE_FIELD, LEG_TYPE_MAP } from '@/constants/common';
import { Checkbox, Form2, Select } from '@/containers';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

const unAnnualArray = [LEG_TYPE_MAP.FORWARD, LEG_TYPE_MAP.CASH_FLOW];

const SelectCheckbox = props => {
  const { value, onChange = () => {} } = props;
  const normalValue = () => {
    if (value === true) {
      return 'true';
    }
    return 'false';
  };

  return (
    <Select
      {...props}
      value={normalValue()}
      onChange={_value => {
        const formatValue = () => {
          if (_value === 'true') {
            return true;
          }
          return false;
        };
        onChange(formatValue());
      }}
      options={[
        {
          label: '是',
          value: 'true',
        },
        {
          label: '否',
          value: 'false',
        },
      ]}
    ></Select>
  );
};

export const IsAnnual: ILegColDef = {
  title: '年化/非年华',
  dataIndex: LEG_FIELD.IS_ANNUAL,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);

    if (unAnnualArray.includes(Form2.getFieldValue(record[LEG_TYPE_FIELD]))) {
      return false;
    }

    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: false,
  render: (val, record, index, { form, editing, colDef }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [getRequiredRule()],
      })(<SelectCheckbox editing={editing} defaultOpen></SelectCheckbox>)}
    </FormItem>
  ),
};
