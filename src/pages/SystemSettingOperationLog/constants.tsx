import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { DatePicker } from 'antd';
import { Select, Input } from '@/containers';
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
                label: '用户登录',
                value: '用户登录',
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
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      }
      return value;
    },
  },
];

export const errorSearchFormControls = [
  {
    title: '操作用户',
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
    title: '操作时间',
    dataIndex: 'operationDate',
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <RangePicker
            allowClear={false}
            showTime={{
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }}
          />,
        )}
      </FormItem>
    ),
  },
];

export const errorTableColDefs = [
  {
    title: '操作用户',
    dataIndex: 'username',
    width: 200,
    render: val => (
      <span
        style={{
          overflow: 'hidden',
          display: 'inline-block',
          wordBreak: 'break-all',
          width: '100%',
        }}
      >
        {val}
      </span>
    ),
  },
  {
    title: '操作时间',
    dataIndex: 'createdAt',
    width: 200,
    render: (value, record, index) => {
      if (value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      }
      return value;
    },
  },
  {
    title: '方法名',
    dataIndex: 'requestMethod',
    width: 200,
  },
  {
    title: '请求参数',
    dataIndex: 'requestParams',
    width: 250,
    render: val => (
      <span
        style={{
          overflow: 'hidden',
          display: 'inline-block',
          wordBreak: 'break-all',
          width: '100%',
        }}
      >
        {val}
      </span>
    ),
  },
  {
    title: '错误信息',
    dataIndex: 'errorMessage',
    width: 250,
    render: val => (
      <span
        style={{
          overflow: 'hidden',
          display: 'inline-block',
          wordBreak: 'break-all',
          width: '100%',
        }}
      >
        {val}
      </span>
    ),
  },
  {
    title: '报错位置',
    dataIndex: 'errorStackTrace',
    width: 250,
    render: val => (
      <span
        style={{
          overflow: 'hidden',
          display: 'inline-block',
          wordBreak: 'break-all',
          width: '100%',
        }}
      >
        {val}
      </span>
    ),
  },
];
