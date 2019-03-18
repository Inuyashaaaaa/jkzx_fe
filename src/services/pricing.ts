import { HOST_TEST } from '@/constants/global';
import { request } from '@/lib/utils';
import _ from 'lodash';

export async function prcBaseContractsList(params = {}) {
  return request(`${HOST_TEST}pricing-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'prcBaseContractsList',
      params,
    },
  }).then(result => {
    const { error, data } = result;
    if (error) return result;

    return {
      // null 在表单使用中是当做 has value 对待的
      // 在 services 统一做一次处理
      data: data.map(item =>
        _.mapValues(item, val => {
          if (val === null) {
            return undefined;
          }
          return val;
        })
      ),
      error,
    };
  });
}

export function updateBaseContract(params) {
  return request(`${HOST_TEST}pricing-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'prcBaseContractsCreateOrUpdate',
      params,
    },
  });
}

export function mktInstrumentsListPaged(params) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'mktInstrumentsListPaged',
      params: {
        assetClass: 'equity',
        instrumentType: 'index_futures',
        ...params,
      },
    },
  });
}

export async function prcTrialService(params = {}) {
  return request(`${HOST_TEST}pricing-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'prcTrial',
      params,
    },
  });
}

export async function prcTrialPositionsService(params = {}) {
  return request(`${HOST_TEST}pricing-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'prcTrialPositions',
      params,
    },
  });
}
