import { HOST_TEST } from '@/constants/global';
import request from '@/tools/request';

export async function wkProcessStatusModify(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessStatusModify',
      params,
    },
  });
}

export async function wkTaskApproveGroupList(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkTaskApproveGroupList',
      params,
    },
  });
}

export async function wkTaskApproveGroupCreateBatch(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkTaskApproveGroupCreateBatch',
      params,
    },
  });
}

export async function wkTaskApproveGroupDelete(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkTaskApproveGroupDelete',
      params,
    },
  });
}

export async function wkTaskApproveGroupModify(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkTaskApproveGroupModify',
      params,
    },
  });
}

export async function wkProcessList(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessList',
      params,
    },
  });
}

export async function wkGlobalConfigList(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkGlobalConfigList',
      params,
    },
  });
}

export async function wkGlobalConfigModify(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkGlobalConfigModify',
      params,
    },
  });
}

export async function wkProcessGet(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessGet',
      params,
    },
  });
}

export async function wkProcessModify(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessModify',
      params,
    },
  });
}

export async function wkProcessConfigModify(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessConfigModify',
      params,
    },
  });
}

export async function wkTaskApproveGroupBind(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkTaskApproveGroupBind',
      params,
    },
  });
}

export async function wkProcessInstanceListByProcessName(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessInstanceListByProcessName',
      params,
    },
  });
}

export async function wkProcessTriggerList(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessTriggerList',
      params,
    },
  });
}

export async function wkIndexList(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkIndexList',
      params,
    },
  });
}

export async function wkProcessTriggerModify(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessTriggerModify',
      params,
    },
  });
}

export async function wkTriggerConditionModify(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkTriggerConditionModify',
      params,
    },
  });
}

export async function wkProcessTriggerCreate(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessTriggerCreate',
      params,
    },
  });
}

export async function wkTriggerConditionCreate(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkTriggerConditionCreate',
      params,
    },
  });
}

export async function wkProcessTriggerDelete(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessTriggerDelete',
      params,
    },
  });
}

export async function wkProcessTriggerBusinessModify(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessTriggerBusinessModify',
      params,
    },
  });
}

export async function wkProcessTriggerBusinessCreate(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessTriggerBusinessCreate',
      params,
    },
  });
}

export async function wkProcessTriggerBind(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessTriggerBind',
      params,
    },
  });
}

export async function wkProcessTriggerUnbind(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkProcessTriggerUnbind',
      params,
    },
  });
}

export async function authCan(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authCan',
      params,
    },
  });
}
