import FormItem from 'antd/lib/form/FormItem';
import { Input as AntdInput } from 'antd';
import React from 'react';
import { Form2 } from '@/containers';
import { IFormColDef } from '@/components/type';

export const RESET_FORM: IFormColDef[] = [
  {
    dataIndex: 'password',
    title: '密码',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '必填',
            },
            {
              pattern: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z]).{12,30}/,
              message: '密码必须包含至少一位数字、字母、以及其他特殊字符，且不小于12位',
            },
          ],
        })(<AntdInput.Password placeholder="至少一位数字、字母以及其他特殊字符，且不少于12位" />)}
      </FormItem>
    ),
  },
  {
    dataIndex: 'confirmpassword',
    title: '确认密码',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '必填',
            },
            {
              validator(rule, value, cb) {
                if (Form2.getFieldValue(record.password) !== value) {
                  cb('2次密码输入不一致');
                }
                cb();
              },
            },
          ],
        })(<AntdInput.Password placeholder="请与密码保持一致" />)}
      </FormItem>
    ),
  },
];
