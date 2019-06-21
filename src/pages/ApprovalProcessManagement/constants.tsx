export const processNum = {
  dataIndex: 'processSequenceNum',
  title: '审批单号',
};

export const processName = {
  dataIndex: 'processName',
  title: '审批类型',
  width: 250,
};

export const initiatorName = {
  dataIndex: 'initiatorName',
  title: '发起人',
  width: 200,
};

export const operatorName = {
  dataIndex: 'operatorName',
  title: '操作人',
};

export const subject = {
  dataIndex: 'subject',
  title: '标题',
  width: 200,
};

export const startTime = {
  dataIndex: 'startTime',
  title: '发起时间',
  width: 200,
};
export const taskName = {
  title: '流程节点',
  dataIndex: 'taskName',
  key: 'taskName',
};

export const person = {
  title: '经办/复核人',
  dataIndex: 'userName',
  key: 'userName',
};

export const operation = {
  title: '操作',
  dataIndex: 'operation',
  key: 'operation',
};

export const operateTime = {
  title: '经办时间',
  dataIndex: 'operateTime',
  key: 'operateTime',
};

export const comment = {
  title: '经办/复核人意见',
  dataIndex: 'comment',
  key: 'comment',
};

export const pendingCol = [processNum, processName, initiatorName, subject, startTime];
