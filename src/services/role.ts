import { HOST_TEST } from '@/constants/global';
import request from '@/tools/request';

export async function authRolesList(params = {}, token?) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    token,
    method: 'POST',
    body: {
      method: 'authRoleList',
      params,
    },
  });
}

export async function createRole(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'authRoleCreate',
      params,
    },
  });
}

export async function updateRole(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'authRoleUpdate',
      params,
    },
  });
}

export async function deleteRole(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'authRoleRevoke',
      params,
    },
  });
}

export async function queryAllPagePermissions(params = {}, token?) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    token,
    method: 'POST',
    body: {
      method: 'authPageComponentList',
      params,
    },
  });
}

export async function queryRolePagePermissions(params = {}, token?) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    token,
    method: 'POST',
    body: {
      method: 'authPagePermissionGet',
      params,
    },
  });
}

export async function updateRolePagePermissions(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'authPagePermissionSet',
      params,
    },
  });
}

export async function authPagePermissionGetByRoleId(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'authPagePermissionGetByRoleId',
      params,
    },
  });
}

export async function initPagePermissions(token?) {
  return Promise.all([
    queryRolePagePermissions({}, token),
    queryAllPagePermissions({}, token),
    authRolesList({}, token),
  ]);
}

export async function authSysLogList(params = {}, token?) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    token,
    method: 'POST',
    body: {
      method: 'authSysLogList',
      params,
    },
  });
}

export async function authErrorLogList(params = {}, token?) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    token,
    method: 'POST',
    body: {
      method: 'authErrorLogList',
      params,
    },
  });
}
