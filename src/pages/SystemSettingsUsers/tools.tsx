/* eslint-disable  max-len */
import FormItem from 'antd/lib/form/FormItem';
import { TreeSelect, Input as AntdInput } from 'antd';
import React from 'react';
import { Input, Select, Form2 } from '@/containers';
import { IFormColDef } from '@/components/type';

export const CREATE_FORM_CONTROLS: (departments, roleOptions) => IFormColDef[] = (
  departments,
  roleOptions,
) => [
  {
    title: '用户名',
    dataIndex: 'username',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '必填',
            },
          ],
        })(<Input />)}
      </FormItem>
    ),
  },
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
  {
    title: '部门',
    dataIndex: 'departmentId',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '必填',
            },
          ],
        })(<TreeSelect treeData={departments} treeDefaultExpandAll />)}
      </FormItem>
    ),
  },
  {
    title: '用户类型',
    dataIndex: 'userType',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '必填',
            },
          ],
        })(
          <Select
            options={[
              { label: '普通用户', value: 'NORMAL' },
              { label: '脚本用户', value: 'SCRIPT' },
            ]}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    render: (val, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>
    ),
  },
  {
    title: '邮箱',
    dataIndex: 'contactEmail',
    render: (val, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>
    ),
  },
  {
    title: '角色',
    dataIndex: 'roleIds',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(<Select options={roleOptions} mode="multiple" />)}
      </FormItem>
    ),
  },
];

export const UPDATE_FORM_CONTROLS = departments => [
  {
    title: '用户名',
    dataIndex: 'username',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '必填',
            },
          ],
        })(<Input />)}
      </FormItem>
    ),
  },
  {
    title: '部门',
    dataIndex: 'departmentId',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '必填',
            },
          ],
        })(
          <TreeSelect
            treeData={departments}
            treeDefaultExpandAll
            disabled={record.username.value === 'admin'}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '用户类型',
    dataIndex: 'userType',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '必填',
            },
          ],
        })(
          <Select
            options={[
              { label: '普通用户', value: 'NORMAL' },
              { label: '脚本用户', value: 'SCRIPT' },
            ]}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    render: (val, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>
    ),
  },
  {
    title: '邮箱',
    dataIndex: 'contactEmail',
    render: (val, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>
    ),
  },
];
