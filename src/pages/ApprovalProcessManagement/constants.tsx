import { PROCESS_STATUS_TYPE_OPTIONS } from '@/constants/common';
import { IColumnDef } from '@/design/components/Table/types';
import React from 'react';
import Operation from './Operation';

const processNum = {
  field: 'processSequenceNum',
  headerName: '审批单号',
  width: 270,
};

const processName = {
  field: 'processName',
  headerName: '审批类型',
  width: 250,
};

const initiatorName = {
  field: 'initiatorName',
  headerName: '发起人',
  width: 200,
};

const operatorName = {
  field: 'operatorName',
  headerName: '操作人',
};

const subject = {
  field: 'subject',
  headerName: '标题',
  wdith: 200,
};

const startTime = {
  field: 'startTime',
  headerName: '发起时间',
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

export const PENDING_COL_DEFS: (fetchTable) => IColumnDef[] = fetchTable => [
  // {
  //   field: 'processSequenceNum',
  //   headerName: '审批单号',
  //   width: 250,
  // },
  // {
  //   field: 'processName',
  //   headerName: '审批类型',
  // },
  // {
  //   field: 'initiatorName',
  //   headerName: '发起人',
  // },
  // {
  //   field: 'subject',
  //   headerName: '标题',
  // },
  // {
  //   field: 'startTime',
  //   headerName: '发起时间',
  // },
  ...pendingCol,
  {
    headerName: '操作',
    width: 440,
    pinned: 'right',
    render: params => {
      return <Operation formData={params.data} status="pending" fetchTable={fetchTable} />;
    },
  },
];

export const RELATED_COL_DEFS: (fetchTable) => IColumnDef[] = fetchTable => [
  // {
  //   field: 'processSequenceNum',
  //   headerName: '审批单号',
  //   width: 300,
  // },
  // {
  //   field: 'processName',
  //   headerName: '审批类型',
  // },
  // {
  //   field: 'initiatorName',
  //   headerName: '发起人',
  // },
  // {
  //   field: 'subject',
  //   headerName: '标题',
  // },
  // {
  //   field: 'startTime',
  //   headerName: '发起时间',
  // },
  ...pendingCol,
  {
    field: 'status',
    headerName: '流程状态',
    width: 160,
    input: {
      type: 'select',
      options: PROCESS_STATUS_TYPE_OPTIONS,
    },
  },
  {
    headerName: '操作',
    width: 340,
    pinned: 'right',
    render: params => {
      return <Operation formData={params.data} status="related" fetchTable={fetchTable} />;
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
        title: item.headerName,
        key: item.field,
        dataIndex: item.field,
      };
      if (item.field === 'processSequenceNum') {
        obj.width = 120;
      }
      return obj;
    });
  }

  if (type === 'process') {
    return [taskName, person, operation, operateTime, comment];
  }
}
