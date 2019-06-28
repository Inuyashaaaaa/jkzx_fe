import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import { Select, Input } from '@/containers';
import React from 'react';
import GroupList from './Operation/GroupList';

export const PROCESS_CONFIGS = [
  {
    label: '不允许审批自己发起的审批单',
    value: 'can_start_by_self',
  },
];

export const TASKTYPE = {
  insertData: 'INPUT_DATA',
  modifyData: 'MODIFY_DATA',
  reviewData: 'REVIEW_DATA',
};

export const REVIEW_DATA = 'reviewData';

export const TRIGGERTYPE = [
  {
    label: '默认触发',
    value: 'all',
  },
];

export const OPERATION_MAP = {
  OR: '满足任一条件时触发',
  AND: '满足所有条件时触发',
};

export const operation = [
  {
    label: '满足任一条件时触发',
    value: 'OR',
  },
  {
    label: '满足所有条件时触发',
    value: 'AND',
  },
];

export const symbol = [
  {
    label: '大于',
    value: 'GT',
  },
  {
    label: '小于',
    value: 'LT',
  },
  {
    label: '等于',
    value: 'EQ',
  },
  {
    label: '大于等于',
    value: 'GE',
  },
  {
    label: '小于等于',
    value: 'LE',
  },
];

export const SYMBOL_MAP = {
  GT: '>',
  LT: '<',
  EQ: '=',
  GE: '>=',
  LE: '<=',
};

export const RETURN_NUMBER = 'returnNumberIndexImpl';

export const columns1 = [
  {
    title: '当前流程',
    dataIndex: 'processName',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(<Input style={{ width: 250 }} editing={false} />)}
        </FormItem>
      );
    },
  },
  // {
  //   title: '触发方式',
  //   dataIndex: 'byTrigger',
  //   render: (value, record, index, { form, editing }) => {
  //     return (
  //       <FormItem>
  //         {form.getFieldDecorator({
  //           rules: [{ required: true }],
  //         })(<Select style={{ width: 250 }} options={TRIGGERTYPE} />)}
  //       </FormItem>
  //     );
  //   },
  // },
  {
    title: '组合方式',
    dataIndex: 'operation',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [{ required: true, message: '组合方式为必填项' }],
          })(<Select style={{ width: 250 }} options={_.concat(TRIGGERTYPE, operation)} />)}
        </FormItem>
      );
    },
  },
];

export const columns2 = [
  {
    title: '当前流程',
    dataIndex: 'processName',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(<Input style={{ width: 250 }} editing={false} />)}
        </FormItem>
      );
    },
  },
  // {
  //   title: '触发方式',
  //   dataIndex: 'byTrigger',
  //   render: (value, record, index, { form, editing }) => {
  //     return (
  //       <FormItem>
  //         {form.getFieldDecorator({
  //           rules: [{ required: true }],
  //         })(<Select style={{ width: 250 }} options={TRIGGERTYPE} />)}
  //       </FormItem>
  //     );
  //   },
  // },
  {
    title: '组合方式',
    dataIndex: 'operation',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [{ required: true, message: '组合方式为必填项' }],
          })(<Select style={{ width: 250 }} options={_.concat(TRIGGERTYPE, operation)} />)}
        </FormItem>
      );
    },
  },
  {
    title: '条件列表',
    dataIndex: 'conditions',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [{ required: true, message: '条件列表为必填项' }],
          })(
            <GroupList
              getCurrent={node => ($formModel.current = node)}
              {...{ record, index, form, editing }}
            />
          )}
        </FormItem>
      );
    },
  },
];
