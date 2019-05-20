import { HOST_TEST } from '@/constants/global';
import request from '@/utils/request';

// 获取部门列表
export async function queryAuthDepartmentList(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authAllDepartmentGet',
      params,
    },
  });
}

// 创建部门
export async function creatAuthDepartment(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authDepartmentCreate',
      params,
    },
  });
}
// 修改部门
export async function modifyAuthDepartment(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authDepartmentModify',
      params,
    },
  });
}
// 移动部门
export async function moveAuthDepartment(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authDepartmentMove',
      params,
    },
  });
}

// 删除部门
export async function removeAuthDepartment(params) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authDepartmentRemove',
      params,
    },
  });
}
