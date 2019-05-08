import { UnitInputNumber } from '@/containers/UnitInputNumber';
import FormItem from 'antd/lib/form/FormItem';
import { Form2, InputNumber } from '@/design/components';
import React from 'react';

export const inputNumberDigitalConfig = (value, record, index, form) => {
  return (
    <FormItem>
      {form.getFieldDecorator({})(<InputNumber autoSelect={false} editing={false} precision={4} />)}
    </FormItem>
  );
};
