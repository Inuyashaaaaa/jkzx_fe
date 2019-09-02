import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { DatePicker } from 'antd';
import { Select } from '@/containers';
import { authUserList } from '@/services/user';

const { RangePicker } = DatePicker;

export const searchFormControls = [
  {
    title: '用户',
    dataIndex: 'username',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请选择"
            allowClear
            // showSearch
            fetchOptionsOnSearch
            options={async (value: string = '') => {
              const { data, error } = await authUserList({});
              if (error) return [];
              return _.sortBy(data, 'username').map(item => ({
                label: item.username,
                value: item.username,
              }));
            }}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '操作事件',
    dataIndex: 'operation',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear
            showSearch
            fetchOptionsOnSearch
            options={[
              {
                label: '用户登陆',
                value: '用户登陆',
              },
              {
                label: '用户登出',
                value: '用户注销',
              },
            ]}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '操作日期',
    dataIndex: 'operationDate',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '操作日期为必填项',
            },
          ],
        })(<RangePicker allowClear={false} />)}
      </FormItem>
    ),
  },
];

export const tableColDefs = [
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '操作事件',
    dataIndex: 'operation',
  },
  {
    title: '服务名',
    dataIndex: 'service',
  },
  {
    title: '方法名',
    dataIndex: 'method',
  },
  {
    title: '操作时间',
    dataIndex: 'createdAt',
    render: (value, record, index) => {
      if (value) {
        return moment(value).format('YYYY-MM-DD');
      }
      return value;
    },
  },
];
