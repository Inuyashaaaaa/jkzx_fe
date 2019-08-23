import fetch from 'dva/fetch';
import { notification, message } from 'antd';
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

export const DOWN_LOAD_TRADE_URL = `${HOST_TEST}document-service/bct/download/supplementary_agreement/?`;

export const DOWN_LOAD_SETTLEMENT_URL = `${HOST_TEST}document-service/bct/download/settlement/?`;

export const DOWN_LOAD_TRADE_URL_POI = `${HOST_TEST}document-service/bct/download/poi/supplementary_agreement/?`;

export const DOWN_LOAD_SETTLEMENT_URL_POI = `${HOST_TEST}document-service/bct/download/poi/settlement/?`;

export const DOWN_LOAD_VALUATION_URL = `${HOST_TEST}document-service/bct/download/valuationReport?valuationReportId=`;

export const HREF_UPLOAD_URL = `${HOST_TEST}document-service/bct/download/bct-template?templateId=`;

export const UPLOAD_URL = `${HOST_TEST}document-service/api/upload/rpc`;

export const COMFIRM_POI_URL = `${HOST_TEST}document-service/bct/download/poi/poi-template?poiTemplateId=`;

export async function DOWN_LOAD(url, options) {
  return fetch(`${url}${encodeURI(options)}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then(response => {
      if (response.headers.get('statustext')) {
        const errortext = decodeURIComponent(response.headers.get('statustext'));
        const error = new Error(errortext);
        error.code = response.status;
        throw error;
      }
      if (response.status >= 200 && response.status < 300) {
        return response.blob();
        // return response.url;
      }
      const errortext = response.statusText;
      const error = new Error(errortext);
      error.code = response.status;
      throw error;
    })
    .then(blob => {
      if (window.webkitURL) {
        return window.webkitURL.createObjectURL(blob);
      }
      if (window.URL && window.URL.createObjectURL) {
        return window.URL.createObjectURL(blob);
      }
      return null;
    })
    .catch(error => {
      const { code, message: msg } = error;
      // notification.error({
      //   message: '请求失败',
      //   description: message,
      // });
      message.error(msg);
      const failAction = { error };

      if (code === 401) {
        notification.error({
          message: '3秒后自动跳转登录页',
        });
        setTimeout(() => {
          const urlParams = new URL(window.location.href);
          const { pathname } = urlParams;
          const loginUrl = pathname.split('/')[1] === 'center' ? '/center/login' : '/user/login';

          // eslint-disable-next-line  no-underscore-dangle
          window.g_app._store.dispatch({
            type: 'login/logout',
            payload: {
              loginUrl,
            },
          });
        }, 3000);

        return failAction;
      }

      return failAction;
    });
}
