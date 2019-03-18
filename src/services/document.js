import { HOST_TEST } from '@/constants/global';
import request from '@/lib/utils/request';
// 查询所有模板信息
export async function queryTemplateList(params = {}) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'docBctTemplateList',
      params,
    },
  });
}

// 创建模板
export async function createTemplate(params = {}) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'docBctTemplateCreate',
      params,
    },
  });
}

// 删除模板
export async function deleteTemplate(params = {}) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'docBctTemplateDelete',
      params,
    },
  });
}

// 删除文档
export async function partyDocDelete(params) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'partyDocDelete',
      params,
    },
  });
}

// 查询交易对手文档
export async function getPartyDoc(params) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'getPartyDoc',
      params,
    },
  });
}

export const UPLOAD_URL = `${HOST_TEST}document-service/api/upload/rpc`;

export const HREF_UPLOAD_URL = `${HOST_TEST}document-service/bct/download/bct-template?templateId=`;

export const DOWN_LOAD_FIEL_URL = `${HOST_TEST}document-service/bct/download/bct-template?templateId=`;
