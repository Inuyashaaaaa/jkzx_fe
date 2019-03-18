import { HOST_TEST } from '@/constants/global';
import request from '@/lib/utils/request';

export async function authRolesList(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authRoleList',
      params: {},
    },
  });
}

export async function createRole(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authRoleCreate',
      params,
    },
  });
}

export async function updateRole(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authRoleUpdate',
      params,
    },
  });
}

export async function deleteRole(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authRoleRevoke',
      params,
    },
  });
}

export async function queryAllPagePermissions(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authPageComponentList',
      params,
    },
  });
}

export async function queryRolePagePermissions(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authPagePermissionGet',
      params,
    },
  });
}

export async function updateRolePagePermissions(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authPagePermissionSet',
      params,
    },
  });
}

export async function initPagePermissions() {
  return Promise.all([
    queryRolePagePermissions({}),
    queryAllPagePermissions({}),
    authRolesList({}),
  ]);
}
