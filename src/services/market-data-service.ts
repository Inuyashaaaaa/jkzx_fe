import { HOST_TEST } from '@/constants/global';
import request from '@/utils/request';

export async function mktInstrumentWhitelistSearch(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktInstrumentWhitelistSearch',
      params,
    },
  });
}

export async function mktInstrumentSearch(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktInstrumentSearch',
      params,
    },
  });
}

export async function searchTradableInstrument(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'searchTradableInstrument',
      params,
    },
  });
}

export async function mktInstrumentsListPaged(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktInstrumentsListPaged',
      params,
    },
  });
}

export async function mktAllInstrumentWhitelistSave(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktAllInstrumentWhitelistSave',
      params,
    },
  });
}

export async function mktInstrumentWhitelistDelete(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktInstrumentWhitelistDelete',
      params,
    },
  });
}

export async function mktInstrumentWhitelistSave(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktInstrumentWhitelistSave',
      params,
    },
  });
}
export async function mktQuotesListPaged(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktQuotesListPaged',
      params,
    },
  });
}

export async function mktInstrumentIdsList(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktInstrumentIdsList',
      params,
    },
  });
}

export async function mktInstrumentCreate(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktInstrumentCreate',
      params,
    },
  });
}

export async function mktInstrumentDelete(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktInstrumentDelete',
      params,
    },
  });
}

export async function mktInstrumentInfo(params = {}) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktInstrumentInfo',
      params,
    },
  });
}

export async function mktInstrumentWhitelistListPaged(params = { instrumentIds: [] }) {
  return request(`${HOST_TEST}market-data-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'mktInstrumentWhitelistListPaged',
      params,
    },
  });
}
