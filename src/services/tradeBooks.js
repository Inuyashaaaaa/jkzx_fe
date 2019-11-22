import { HOST_TEST } from '@/constants/global';
import request from '@/tools/request';
// 查询交易薄
export async function queryNonGroupResource(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authBookGetCanRead',
      params,
    },
  });
}

// 添加交易薄
export async function addNonGroupResource(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authNonGroupResourceAdd',
      params,
    },
  });
}

// 修改交易薄
export async function updateNonGroupResource(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authNonGroupResourceModify',
      params,
    },
  });
}
// 删除交易薄
export async function deleteNonGroupResource(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'authNonGroupResourceRevoke',
      params,
    },
  });
}

export async function rptReportInstrumentListByValuationDate(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptReportInstrumentListByValuationDate',
      params,
    },
  });
}

export async function rptReportSubsidiaryListByValuationDate(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptReportSubsidiaryListByValuationDate',
      params,
    },
  });
}

export async function rptReportCounterPartyListByValuationDate(params = {}) {
  return request(`${HOST_TEST}report-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'rptReportCounterPartyListByValuationDate',
      params,
    },
  });
}
