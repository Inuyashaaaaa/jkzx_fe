import { HOST_TEST } from '@/constants/global';
import request from '@/utils/request';

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
