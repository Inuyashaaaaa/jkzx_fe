import { HOST_TEST } from '@/constants/global';
import request from '@/tools/request';

// 查询资源权限
export async function queryResourceAuthes(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authResourceGet',
      params,
    },
  });
}

// 查询用户资源权限
export async function queryUserResourceAuthes(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authResourceGetByUserId',
      params,
    },
  });
}

// 修改用户资源权限
export async function modifyUserResourceAuthes(params) {
  // return request('auth-service/api/rpc', 'POST', 'authAllDepartmentGet', params);
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authPermissionsModify',
      params,
    },
  });
}

// 查询角色资源权限
export async function queryRoleResourceAuthes(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authResourceGetByRoleId',
      params,
    },
  });
}

// 修改角色资源权限
export async function modifyRoleResourceAuthes(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authRolePermissionsModify',
      params,
    },
  });
}

// 修改资源权限
export async function modifyResource(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authResourceModify',
      params,
    },
  });
}

// 创建资源权限
export async function createResource(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authResourceCreate',
      params,
    },
  });
}

// 删除资源权限
export async function revokeResource(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authResourceRevoke',
      params,
    },
  });
}
