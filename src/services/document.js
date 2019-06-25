import fetch from 'dva/fetch';
import { HOST_TEST } from '@/constants/global';
import request from '@/tools/request';

import { getToken } from '@/tools/authority';
// 查询所有模板信息
export async function queryTemplateList(params = {}) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'docBctTemplateList',
      params,
    },
  });
}

// 查询交易确认书模版信息
export async function docPoiTemplateList(params = {}) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'docPoiTemplateList',
      params,
    },
  });
}

// 创建模板
export async function createTemplate(params = {}) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'docBctTemplateCreate',
      params,
    },
  });
}

// 删除模板
export async function deleteTemplate(params = {}) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'docBctTemplateDelete',
      params,
    },
  });
}

// 删除交易文档模板
export async function docPoiTemplateDelete(params = {}) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'docPoiTemplateDelete',
      params,
    },
  });
}

// 删除文档
export async function partyDocDelete(params) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'partyDocDelete',
      params,
    },
  });
}

// 查询交易对手文档
export async function getPartyDoc(params) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getPartyDoc',
      params,
    },
  });
}

// 发送交易确认书
export async function emlSendSupplementaryAgreementReport(params) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'emlSendSupplementaryAgreementReport',
      params,
    },
  });
}

// 发送结算通知书
export async function emlSendSettleReport(params) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'emlSendSettleReport',
      params,
    },
  });
}

export const UPLOAD_URL = `${HOST_TEST}document-service/api/upload/rpc`;

export const HREF_UPLOAD_URL = `${HOST_TEST}document-service/bct/download/bct-template?templateId=`;

export const COMFIRM_POI_URL = `${HOST_TEST}document-service/bct/download/poi/poi-template?poiTemplateId=`;

export const DOWN_LOAD_FIEL_URL = `${HOST_TEST}document-service/bct/download/bct-template?templateId=`;

export const DOWN_LOAD_VALUATION_URL = `${HOST_TEST}document-service/bct/download/valuationReport?valuationReportId=`;

export const DOWN_LOAD_TRADE_URL = `${HOST_TEST}document-service/bct/download/poi/supplementary_agreement?`;

export const DOWN_LOAD_SETTLEMENT_URL = `${HOST_TEST}document-service/bct/download/poi/settlement?`;

export async function DOWN_LOAD_TRADE_URL_URL(options) {
  return fetch(`${DOWN_LOAD_TRADE_URL}${options}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
  }).then(res => {
    console.log(res);
    return res.json();
  });
}
