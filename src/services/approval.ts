import { HOST_TEST } from '@/constants/global';
import request from '@/utils/request';
import { getToken } from '@/utils/authority';

// 创建审批流程
export async function createApprovalProcess(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceCreate',
      params,
    },
  });
}

export async function wkProcessInstanceComplexList(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceComplexList',
      params,
    },
  });
}

// 查询审批流程列表
export async function queryProcessList(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceList',
      params,
    },
  });
}

// 查询待办审批流程列表
export async function queryProcessToDoList(
  params = {
    taskType: 'TODO',
    keyword: '',
  }
) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkTaskInfoList',
      params,
    },
  });
}

// 查询已完成流程
export async function queryProcessHistoryList(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceHistoryList',
      params,
    },
  });
}

// 查询流程图
// export async function queryProcessDiagram(params = {}) {
//   return request(`${HOST_TEST}workflow-service/api/rpc`, {
//     method: `POST`,
//     body: {
//       method: 'wkProcessInstanceDiagramGet',
//       params,
//     },
//   });
// }

// 查询流程审批单
export async function queryProcessForm(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceFormGet',
      params,
    },
  });
}

// 查询已完成流程审批单
export async function queryProcessHistoryForm(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkHistoricProcessInstanceFormGet',
      params,
    },
  });
}

// 查询流程审批历史记录列表
export async function queryProcessRecordList(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceHistoryList',
      params,
    },
  });
}

// 修改审批单内容
export async function modifyProcessForm(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceFormModify',
      params,
    },
  });
}

// 修改审批流程状态
export async function modifyProcessState(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceStatusModify',
      params,
    },
  });
}

// 终止审批
export async function terminateProcess(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceTerminate',
      params,
    },
  });
}

// 通过审核
export async function completeTaskProcess(params = {}) {
  // debugger
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkTaskComplete',
      params,
    },
  });
}

// 查询流程图
export async function queryProcessDiagram(params) {
  return fetch(`${HOST_TEST}workflow-service/${params.processInstanceId}/image`, {
    method: `GET`,
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then(response => response.blob())
    .then(imageBlob => {
      if (window.webkitURL) {
        return window.webkitURL.createObjectURL(imageBlob);
      } else if (window.URL && window.URL.createObjectURL) {
        return window.URL.createObjectURL(imageBlob);
      } else {
        return null;
      }
    });
}
// 	获取流程实例审批单内容
export async function wkProcessInstanceFormGet(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceFormGet',
      params,
    },
  });
}

// 获取流程实例信息
export async function wkProcessGet(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessGet',
      params,
    },
  });
}

// 发起审批流程
export async function wkProcessInstanceCreate(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceCreate',
      params,
    },
  });
}

// 上传附件
export async function wkAttachmentCreateOrUpdate(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkAttachmentCreateOrUpdate',
      params,
    },
  });
}

export const UPLOAD_URL = `${HOST_TEST}workflow-service/api/upload/rpc`;
export const downloadTradeAttachment = `${HOST_TEST}workflow-service/bct/download/attachment?attachmentId=`;

// 附件关联流程实例
export async function wkAttachmentProcessInstanceModify(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkAttachmentProcessInstanceBind',
      params,
    },
  });
}

export async function wkAttachmentList(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkAttachmentList',
      params,
    },
  });
}

export async function wkTaskComplete(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkTaskComplete',
      params,
    },
  });
}
