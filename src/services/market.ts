import { request } from '@/tools';
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
