import { HOST_TEST } from '@/constants/global';
import request from '@/lib/utils/request';

export async function clientNewTrade(params = {}) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientNewTrade',
      params,
    },
  });
}

export async function clientSettleTrade(params = {}) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientSettleTrade',
      params,
    },
  });
}
