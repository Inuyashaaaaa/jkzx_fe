import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import { Input } from '@/containers';
import GroupSelcet from './Operation/GroupSelcet';
import React from 'react';
import { PROCESS_CONFIGS } from './constants';

export function GTE_PROCESS_CONFIGS(value) {
  const index = _.findIndex(PROCESS_CONFIGS, item => {
    return item.value === value;
  });
  if (index < 0) {
    return value;
  }
  return PROCESS_CONFIGS[index].label;
}

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
