/*eslint-disable */
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
        {form.getFieldDecorator({})(
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
        {form.getFieldDecorator({})(<UnitInputNumber autoSelect editing={editing} unit="%" />)}
      </FormItem>
    ),
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 100,
    render: (val, record, index) => (
      <>
        <a href="javascript:;" onClick={showModal}>
          插入
        </a>
        <Divider type="vertical" />
        <Popconfirm title="确认要删除吗？" onConfirm={() => onRemove(record)}>
          <a href="javascript:;" style={{ color: 'red' }}>
            删除
          </a>
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
