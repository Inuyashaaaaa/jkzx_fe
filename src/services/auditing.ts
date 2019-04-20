import { HOST_TEST } from '@/constants/global';
import request from '@/lib/utils/request';

export async function wkApproveGroupCreate(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkApproveGroupCreate',
      params,
    },
  });
}

export async function wkApproveGroupModify(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkApproveGroupModify',
      params,
    },
  });
}

export async function wkApproveGroupDelete(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkApproveGroupDelete',
      params,
    },
  });
}

export async function wkApproveGroupList(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkApproveGroupList',
      params,
    },
  });
}

export async function wkApproveGroupUserListModify(params = {}) {
  return request(`${HOST_TEST}workflow-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'wkApproveGroupUserListModify',
      params,
    },
  });
}
