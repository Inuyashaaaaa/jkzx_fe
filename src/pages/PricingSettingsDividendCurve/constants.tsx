import { IFormColDef, ITableColDef } from '@/containers/type';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { Select, Input, Form2 } from '@/containers';
import {
  getCanUsedTranorsOtions,
  getCanUsedTranorsOtionsNotIncludingSelf,
} from '@/services/common';
import { Button, Popconfirm, Divider } from 'antd';
import _ from 'lodash';
import { UnitInputNumber } from '@/containers/UnitInputNumber';

const fields2data = item => {
  return _.mapValues(item, (value, key) => {
    return Form2.getFieldValue(value);
  });
};

export const TABLE_COL_DEFS: (tableDataSource, onRemove, showModal) => ITableColDef[] = (
  tableDataSource,
  onRemove,
  showModal
) => [
  {
    title: '期限',
    dataIndex: 'tenor',
    defaultEditing: false,
    editable: record => {
      return true;
    },
    width: 10,
    render: (val, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(
            <Select
              defaultOpen={true}
              autoSelect={true}
              //   style={{ minWidth: 180 }}
              options={getCanUsedTranorsOtions(
                tableDataSource.map(item => fields2data(item)),
                fields2data(record)
              )}
              editing={editing}
            />
          )}
        </FormItem>
      );
    },
  },
  {
    title: '利率(%)',
    dataIndex: 'quote',
    width: 10,
    editable: record => {
      return true;
    },
    defaultEditing: false,
    render: (val, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(
            <UnitInputNumber autoSelect={true} editing={editing} unit={'%'} />
          )}
        </FormItem>
      );
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 10,
    render: (val, record, index) => {
      return (
        <>
          <Button type="link" size="small" onClick={showModal}>
            插入
          </Button>
          <Divider type="vertical" />
          <Popconfirm title="确认要删除吗？" onConfirm={() => onRemove(record)}>
            <Button type="link" size="small" style={{ color: 'red' }}>
              删除
            </Button>
          </Popconfirm>
        </>
      );
    },
  },
];

export const INSERT_FORM_CONTROLS: (tableDataSource) => IFormColDef[] = tableDataSource => [
  {
    title: '期限',
    dataIndex: 'tenor',
    render: (val, record, index, { form }) => {
      return (
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
                tableDataSource.map(item => fields2data(item))
              )}
            />
          )}
        </FormItem>
      );
    },
  },
  {
    title: '利率(%)',
    dataIndex: 'quote',
    render: (val, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
    },
  },
];

export const SEARCH_FORM_CONTROLS: (groups) => IFormColDef[] = groups => [
  {
    title: '标的',
    dataIndex: 'underlyer',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({ rules: [{ required: true, message: '标的必填' }] })(
            <Input disabled={true} placeholder="请选择左侧标的物" />
          )}
        </FormItem>
      );
    },
  },
  {
    dataIndex: 'modelName',
    title: '分组',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({ rules: [{ required: true, message: '标的必填' }] })(
            <Select options={groups} style={{ minWidth: 180 }} />
          )}
        </FormItem>
      );
    },
  },
];
