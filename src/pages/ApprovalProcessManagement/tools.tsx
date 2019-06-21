import { PROCESS_STATUS_TYPE_OPTIONS_LOW } from '@/constants/common';
import React from 'react';
import Operation from './Operation';
import _ from 'lodash';
import {
  processNum,
  processName,
  initiatorName,
  subject,
  startTime,
  operatorName,
  pendingCol,
  taskName,
  person,
  operation,
  operateTime,
  comment,
} from './constants';

export const PENDING_COL_DEFS = fetchTable => [
  ...pendingCol,
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 200,
    render: (text, params, index) => {
      return <Operation formData={params} status="pending" fetchTable={fetchTable} />;
    },
  },
];

export const RELATED_COL_DEFS = fetchTable => [
  ...pendingCol,
  {
    dataIndex: 'processInstanceStatusEnum',
    title: '流程状态',
    width: 160,
    render: (text, params, index) => {
      if (!text) return text;
      const _index = _.findIndex(PROCESS_STATUS_TYPE_OPTIONS_LOW, item => {
        return item.value === text;
      });
      if (_index < 0) return text;
      return PROCESS_STATUS_TYPE_OPTIONS_LOW[_index].label;
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 250,
    render: (text, params, index) => {
      return <Operation formData={params} status="related" fetchTable={fetchTable} />;
    },
  },
];

export function generateColumns(type, tag) {
  if (type === 'approval') {
    const columns =
      tag === 'initiator'
        ? [processNum, processName, initiatorName, subject, startTime]
        : [processNum, processName, operatorName, subject, startTime];

    return columns.map(item => {
      const obj = {
        title: item.title,
        key: item.dataIndex,
        dataIndex: item.dataIndex,
      };
      if (item.dataIndex === 'processSequenceNum') {
        obj.width = 120;
      }
      return obj;
    });
  }

  if (type === 'process') {
    return [taskName, person, operation, operateTime, comment];
  }
}
