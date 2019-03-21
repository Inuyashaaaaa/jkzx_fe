import { HOST_TEST } from '@/constants/global';
import request from '@/lib/utils/request';

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
      Authorization: `Bearer ${localStorage.getItem('tongyu_TOKEN_LOCAL_FIELD')}`,
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
