import { HOST_TEST } from '@/constants/global';
import { request } from '@/utils';

export async function prefPreferenceExist(params = {}) {
  return request(`${HOST_TEST}user-preference-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'prefPreferenceExist',
      params,
    },
  });
}

export async function prefPreferenceGetByUser(params = {}) {
  return request(`${HOST_TEST}user-preference-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `prefPreferenceGetByUser`,
      params,
    },
  });
}

export async function prefPreferenceCreate(params = {}) {
  return request(`${HOST_TEST}user-preference-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `prefPreferenceCreate`,
      params,
    },
  });
}

export async function prefPreferenceVolInstrumentAdd(params = {}) {
  return request(`${HOST_TEST}user-preference-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `prefPreferenceVolInstrumentAdd`,
      params,
    },
  });
}

export async function prefPreferenceDividendInstrumentAdd(params = {}) {
  return request(`${HOST_TEST}user-preference-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `prefPreferenceDividendInstrumentAdd`,
      params,
    },
  });
}

export async function prefPreferenceVolInstrumentDelete(params = {}) {
  return request(`${HOST_TEST}user-preference-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `prefPreferenceVolInstrumentDelete`,
      params,
    },
  });
}

export async function prefPreferenceDividendInstrumentDelete(params = {}) {
  return request(`${HOST_TEST}user-preference-service/api/rpc`, {
    method: `POST`,
    body: {
      method: `prefPreferenceDividendInstrumentDelete`,
      params,
    },
  });
}
