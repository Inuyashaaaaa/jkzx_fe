import { PROCESS_STATUS_TYPE_OPTIONS } from '@/constants/common';
import React from 'react';
import Operation from './Operation';

const processNum = {
  dataIndex: 'processSequenceNum',
  title: '审批单号',
};

const processName = {
  dataIndex: 'processName',
  title: '审批类型',
  width: 250,
};

const initiatorName = {
  dataIndex: 'initiatorName',
  title: '发起人',
  width: 200,
};

const operatorName = {
  dataIndex: 'operatorName',
  title: '操作人',
};

const subject = {
  dataIndex: 'subject',
  title: '标题',
  width: 200,
};

const startTime = {
  dataIndex: 'startTime',
  title: '发起时间',
  width: 200,
};
const taskName = {
  title: '流程节点',
  dataIndex: 'taskName',
  key: 'taskName',
};

const person = {
  title: '经办/复核人',
  dataIndex: 'userName',
  key: 'userName',
};

const operation = {
  title: '操作',
  dataIndex: 'operation',
  key: 'operation',
};

const operateTime = {
  title: '经办时间',
  dataIndex: 'operateTime',
  key: 'operateTime',
};

const comment = {
  title: '经办/复核人意见',
  dataIndex: 'comment',
  key: 'comment',
};

const pendingCol = [processNum, processName, initiatorName, subject, startTime];

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
    dataIndex: 'status',
    title: '流程状态',
    width: 160,
    input: {
      type: 'select',
      options: PROCESS_STATUS_TYPE_OPTIONS,
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
