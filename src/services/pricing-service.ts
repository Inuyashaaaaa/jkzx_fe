import _ from 'lodash';
import { HOST_TEST } from '@/constants/global';
import { request } from '@/tools';

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
  }).then(async res => {
    if (res.error) {
      return [];
    }
    const result = await Promise.all(
      (res.data || []).map(item => prcPricingEnvironmentGet({ pricingEnvironmentId: item })),
    );
    return (result || []).map(item => {
      if (item.error) {
        return {
          pricingEnvironmentId: _.get(item, 'data.pricingEnvironmentId'),
          description: _.get(item, 'data.pricingEnvironmentId'),
        };
      }
      return {
        pricingEnvironmentId: _.get(item, 'data.pricingEnvironmentId'),
        description: _.get(item, 'data.description') || _.get(item, 'data.pricingEnvironmentId'),
      };
    });
  });
}

export async function prcPricingEnvironmentGet(params = {}) {
  return request(`${HOST_TEST}pricing-service/api/rpc`, {
    method: 'POST',
    body: {
      method: 'prcPricingEnvironmentGet',
      params,
    },
  });
}
