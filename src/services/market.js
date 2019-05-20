import { request } from '@/utils';
import { HOST_TEST } from '@/constants/global';

export async function queryMarket(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'mktInstrumentsList',
      params,
    },
  });
}
