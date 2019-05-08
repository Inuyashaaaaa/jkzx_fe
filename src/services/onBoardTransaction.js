import { HOST_TEST } from '@/constants/global';
import request from '@/lib/utils/request';

// 获取场内流水
export async function queryTradeRecord(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'exeTradeRecordSearch',
      params,
    },
  });
}

// 获取场内持仓按明细统计
export async function queryDetail(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'excPositionRecordSearch',
      params,
    },
  });
}

// 获取场内持仓按明细统计
export async function querySummary(params = {}) {
  return request(`${HOST_TEST}auth-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'excPositionRecordSearchGroupByInstrumentId',
      params,
    },
  });
}

// 创建一条场内持仓数据
export async function exeTradeRecordSave(params) {
  return request(`${HOST_TEST}exchange-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'exeTradeRecordSave',
      params,
    },
  });
}

export const uploadUrl = `${HOST_TEST}exchange-service/api/upload/rpc`;

// 模板下载
export async function docBctTemplateList(params) {
  return request(`${HOST_TEST}document-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'docBctTemplateList',
      params,
    },
  });
}

export const downloadUrl = `${HOST_TEST}document-service/bct/download/bct-template?templateId=`;
