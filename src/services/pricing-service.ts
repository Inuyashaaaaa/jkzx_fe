import { HOST_TEST } from '@/constants/global';
import { request } from '@/utils';

export async function prcSpotScenarios(params = {}) {
  return request(`${HOST_TEST}pricing-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'prcSpotScenarios',
      params,
    },
  });
}

export async function prcPricingEnvironmentsList(params = {}) {
  return request(`${HOST_TEST}pricing-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'prcPricingEnvironmentsList',
      params,
    },
  });
}
