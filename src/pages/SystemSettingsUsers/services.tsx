import { IColumnDef } from '@/components/Table/types';
import { IFormControl } from '@/components/_Form2';
import React from 'react';
import { ITableColDef } from '@/components/type';
import FormItem from 'antd/lib/form/FormItem';
import { Select } from '@/components';
import { Divider, Button } from 'antd';
import Operation from './Operation';

export const createPageTableColDefs: ITableColDef[] = (
  roleOptions,
  showResources,
  departments,
  fetchData
) => [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 180,
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    width: 180,
  },
  {
    title: '拥有角色（可编辑）',
    dataIndex: 'roles',
    editable: record => {
      return true;
    },
    defaultEditing: false,
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(
            <Select
              defaultOpen={true}
              editing={editing}
              autoSelect={true}
              options={roleOptions}
              mode={'multiple'}
            />
          )}
        </FormItem>
      );
    },
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    width: 200,
  },
  {
    title: '类型',
    dataIndex: 'userTypeName',
    width: 100,
  },
  {
    title: '邮箱',
    dataIndex: 'contactEmail',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 300,
    render: (value, record, index) => {
      return (
        <Operation
          record={record}
          showResources={showResources}
          departments={departments}
          fetchData={fetchData}
        />
      );
    },
  },
];

export const createFormControls = roles => ({ createFormData }): IFormControl[] => [
  {
    dataIndex: 'userName',
    control: {
      label: '用户名',
    },
    input: { type: 'input' },
    options: {
      rules: [
        {
          required: true,
        },
      ],
    },
  },
  {
    dataIndex: 'password',
    control: { label: '密码' },
    input: { type: 'input', inputType: 'password' },
    options: {
      rules: [
        {
          required: true,
        },
        {
          pattern: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z]).{8,30}/,
          message: '密码必须包含至少一位数字、字母、以及其他特殊字符，且不小于8位',
        },
      ],
    },
  },
  {
    dataIndex: 'confirmpassword',
    control: { label: '确认密码' },
    input: { type: 'input', inputType: 'password' },
    options: {
      rules: [
        {
          required: true,
        },
        {
          validator(rule, value, cb) {
            if (createFormData.password !== value) {
              cb('2次密码输入不一致');
            }
            cb();
          },
        },
      ],
    },
  },
  {
    dataIndex: 'roleIds',
    control: {
      label: '角色',
    },
    input: {
      type: 'select',
      mode: 'multiple',
      options: roles.map(item => {
        return {
          label: item.roleName,
          value: item.uuid,
        };
      }),
    },
  },
];
