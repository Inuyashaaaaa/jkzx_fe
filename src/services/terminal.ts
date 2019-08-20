import { message } from 'antd';
import _ from 'lodash';
import { HOST_TEST } from '@/constants/global';
import request from '@/tools/request';

const composeMsg = (diagnostics = [], prefix) =>
  diagnostics.map(item =>
    message[String.prototype.toLocaleLowerCase.call(item.type)](`${prefix}:${item.message}`),
  );

export async function getInstrumentRollingVol(params) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getInstrumentRollingVol',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  }).then(rsp => {
    if (rsp.error) {
      return rsp;
    }
    composeMsg(_.get(rsp, 'data.diagnostics', []), '波动率曲线');
    return {
      ...rsp,
      data: _.get(rsp, 'data.data', []),
    };
  });
}

export async function getInstrumentVolCone(params) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getInstrumentVolCone',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  }).then(rsp => {
    if (rsp.error) {
      return rsp;
    }
    composeMsg(_.get(rsp, 'data.diagnostics', []), '波动率锥');
    return {
      ...rsp,
      data: _.get(rsp, 'data.data', []),
    };
  });
}

export async function getInstrumentVolSurface(params) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getInstrumentVolSurface',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getInstrumentRealizedVol(params) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getInstrumentRealizedVol',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  }).then(rsp => {
    if (rsp.error) {
      return rsp;
    }
    composeMsg(_.get(rsp, 'data.diagnostics', []), '历史波动率');
    return {
      ...rsp,
      data: _.get(rsp, 'data.data', []),
    };
  });
}

export async function getImpliedVolReport(params = {}) {
  return request(`${HOST_TEST}data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'getImpliedVolReport',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}
