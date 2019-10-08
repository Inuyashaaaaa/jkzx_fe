import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { Input, DatePicker } from '@/containers';

export const EXERCISE_FORM_CONTROLS = [
  // {
  //   title: '期权信息',
  //   dataIndex: 'information',
  //   render: (val, record, index, { form, editing }) => (
  //     <FormItem>{form.getFieldDecorator({})(<Input editing={false} />)}</FormItem>
  //   ),
  // },
  {
    dataIndex: 'cashFlow',
    title: '现金流',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '现金流为必填项',
            },
          ],
        })(<Input editing />)}
      </FormItem>
    ),
  },
  {
    title: '支付日期',
    dataIndex: 'paymentDate',
    render: (val, record, index, { form, editing }) => (
      <FormItem>{form.getFieldDecorator({})(<DatePicker editing format="YYYY-MM-DD" />)}</FormItem>
    ),
  },
];
