import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import { Table2, Select, Form2, Input } from '@/containers';
import GroupSelcet from './Operation/GroupSelcet';
import React, { useRef, useEffect, useState } from 'react';

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

export function GTE_PROCESS_CONFIGS(value) {
  const index = _.findIndex(PROCESS_CONFIGS, item => {
    return item.value === value;
  });
  if (index < 0) {
    return value;
  }
  return PROCESS_CONFIGS[index].label;
}

export const TRIGGERTYPE = [
  {
    label: '全部触发',
    value: false,
  },
  {
    label: '通过触发器',
    value: true,
  },
];

export const OPERATION_MAP = {
  OR: '满足任一条件时触发',
  AND: '满足所有条件时触发',
};

export function COLUMNS(reviewMove, reviewInsert, reviewDelete, reviewTask) {
  return [
    {
      title: '节点名称',
      width: 200,
      dataIndex: 'taskName',
      render: (value, record, index, { form, editing }) => {
        return (
          <FormItem>
            {form.getFieldDecorator({
              rules: [
                {
                  required: true,
                  message: '节点名称为必填项',
                },
                {
                  pattern: /^[^0-9]{1,}/,
                  message: '节点名称不能以数字开头',
                },
              ],
            })(<Input editing={true} />)}
          </FormItem>
        );
      },
    },
    {
      title: '审批组',
      dataIndex: 'approveGroupList',
      width: 250,
      render: (value, record, index, { form, editing }) => {
        return <GroupSelcet record={record} index={index} formData={{ form, editing: true }} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 150,
      render: (value, record, index, { form, editing }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-end ' }}>
            {index !== 0 ? (
              <a style={{ margin: '0 5px' }} onClick={e => reviewMove(1, record, index)}>
                {' '}
                上移{' '}
              </a>
            ) : null}
            {index !== reviewTask.length - 1 ? (
              <a style={{ margin: '0 5px' }} onClick={e => reviewMove(-1, record, index)}>
                {' '}
                下移{' '}
              </a>
            ) : null}
            <a style={{ margin: '0 5px' }} onClick={e => reviewInsert(e, record, index)}>
              {' '}
              插入{' '}
            </a>
            <a style={{ margin: '0 5px' }} onClick={e => reviewDelete(e, record, index)}>
              {' '}
              删除{' '}
            </a>
          </div>
        );
      },
    },
  ];
}
