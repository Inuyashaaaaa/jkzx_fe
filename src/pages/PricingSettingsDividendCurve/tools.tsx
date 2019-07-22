import { Divider, Popconfirm } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { IFormColDef, ITableColDef } from '@/components/type';
import { Form2, Input, Select, InputNumber } from '@/containers';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import {
  getCanUsedTranorsOtions,
  getCanUsedTranorsOtionsNotIncludingSelf,
} from '@/services/common';
import { MARKET_KEY, GROUP_KEY, INSTANCE_KEY } from './constants';

export const TABLE_COL_DEFS: (tableDataSource, onRemove, showModal) => ITableColDef[] = (
  tableDataSource,
  onRemove,
  showModal,
) => [
  {
    title: '期限',
    dataIndex: 'tenor',
    defaultEditing: false,
    width: 300,
    editable: record => true,
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '期限必填',
            },
          ],
        })(
          <Select
            defaultOpen
            autoSelect
            //   style={{ minWidth: 180 }}
            options={getCanUsedTranorsOtions(
              tableDataSource.map(item => Form2.getFieldsValue(item)),
              Form2.getFieldsValue(record),
            )}
            editing={editing}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '利率(%)',
    align: 'right',
    width: 300,
    dataIndex: 'quote',
    editable: record => true,
    defaultEditing: false,
    render: (val, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '利率必填',
            },
          ],
        })(<UnitInputNumber autoSelect editing={editing} unit="%" />)}
      </FormItem>
    ),
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 100,
    render: (val, record, index) => (
      <>
        <a onClick={showModal}>插入</a>
        <Divider type="vertical" />
        <Popconfirm title="确认要删除吗？" onConfirm={() => onRemove(record)}>
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
      </>
    ),
  },
];

export const INSERT_FORM_CONTROLS: (tableDataSource) => IFormColDef[] = tableDataSource => [
  {
    title: '期限',
    dataIndex: 'tenor',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '期限必填',
            },
          ],
        })(
          <Select
            style={{ minWidth: 180 }}
            options={getCanUsedTranorsOtionsNotIncludingSelf(
              tableDataSource.map(item => Form2.getFieldsValue(item)),
            )}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '利率(%)',
    dataIndex: 'quote',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
            },
          ],
        })(<InputNumber />)}
      </FormItem>
    ),
  },
];

export const SEARCH_FORM_CONTROLS: (groups) => IFormColDef[] = groups => [
  {
    title: '标的',
    dataIndex: 'underlyer',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({ rules: [{ required: true, message: '标的必填' }] })(
          <Input disabled placeholder="请选择左侧标的物" />,
        )}
      </FormItem>
    ),
  },
  {
    dataIndex: 'modelName',
    title: '分组',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({ rules: [{ required: true, message: '标的必填' }] })(
          <Select options={groups} style={{ minWidth: 180 }} />,
        )}
      </FormItem>
    ),
  },
];

export const SEARCH_FORM = (groups, formData) => [
  {
    title: '标的',
    dataIndex: MARKET_KEY,
    render: (value, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
            },
          ],
        })(<Select style={{ minWidth: 180 }} placeholder="请选择左侧标的物" disabled />)}
      </FormItem>
    ),
  },
  {
    title: '分组',
    dataIndex: 'modelName',
    render: (value, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
            },
          ],
        })(
          <Select
            style={{ minWidth: 180 }}
            placeholder="选择标的物后，继续选择分组项"
            options={groups}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '定价环境',
    dataIndex: INSTANCE_KEY,
    render: (value, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
            },
          ],
        })(
          <Select
            style={{ minWidth: 180 }}
            placeholder="选择定价环境"
            disabled={!formData.modelName}
            options={[
              {
                label: '日内',
                value: 'INTRADAY',
              },
              {
                label: '收盘',
                value: 'CLOSE',
              },
            ]}
          />,
        )}
      </FormItem>
    ),
  },
];
