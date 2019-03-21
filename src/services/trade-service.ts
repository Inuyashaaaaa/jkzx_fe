import { HOST_TEST } from '@/constants/global';
import request from '@/lib/utils/request';

export async function trdTradeCreate(params) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradeCreate',
      params,
    },
  });
}

export async function trdPositionLCMEventTypes(params) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdPositionLCMEventTypes',
      params,
    },
  }).then(() => {
    return {
      error: false,
      data: ['FIXING'],
    };
  });
}

export async function trdTradeLCMEventProcess(params) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradeLCMEventProcess',
      params,
    },
  });
}

export async function trdBookListBySimilarBookName(params) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdBookListBySimilarBookName',
      params,
    },
  });
}

export async function tradeReferenceGet(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'tradeReferenceGet',
      params,
    },
  });
}

export async function refPartyGetByLegalName(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'refPartyGetByLegalName',
      params,
    },
  });
}

export async function traTradeLCMNotificationSearch(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'traTradeLCMNotificationSearch',
      params,
    },
  });
}

export async function trdInstrumentListByBook(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdInstrumentListByBook',
      params,
    },
  });
}

export async function trdTradeLCMUnwindAmountGet(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradeLCMUnwindAmountGet',
      params,
    },
  });
}

export async function trdPortfolioListBySimilarPortfolioName(params) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdPortfolioListBySimilarPortfolioName',
      params,
    },
  });
}

export async function trdPortfolioSearch(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdPortfolioSearch',
      params,
    },
  });
}

export async function trdTradePortfolioCreateBatch(params) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradePortfolioCreateBatch',
      params,
    },
  });
}

export async function trdPortfolioDelete(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdPortfolioDelete',
      params,
    },
  });
}

export async function trdTradePortfolioDelete(params) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradePortfolioDelete',
      params,
    },
  });
}

export async function trdPortfolioCreate(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdPortfolioCreate',
      params,
    },
  });
}

export async function trdPortfolioUpdate(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdPortfolioUpdate',
      params,
    },
  });
}
