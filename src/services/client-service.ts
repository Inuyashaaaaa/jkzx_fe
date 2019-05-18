import { HOST_TEST } from '@/constants/global';
import request from '@/utils/request';

export async function clientChangePremium(params = {}) {
  return request(`${HOST_TEST}reference-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'clientChangePremium',
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
