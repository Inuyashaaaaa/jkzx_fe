import { HOST_TEST } from '@/constants/global';
import request from '@/tools/request';

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

export async function tradeExercisePreSettle(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'tradeExercisePreSettle',
      params,
    },
  });
}

export async function positionDocSearch(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'positionDocSearch',
      params,
    },
  });
}

export async function tradeDocSearch(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'tradeDocSearch',
      params,
    },
  });
}

export async function quotePrcCreate(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'quotePrcCreate',
      params,
    },
  });
}

export async function quotePrcSearchPaged(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'quotePrcSearchPaged',
      params,
    },
  });
}

export async function quotePrcPositionDelete(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'quotePrcPositionDelete',
      params,
    },
  });
}

export async function trdTradeSettleablePaged(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradeSettleablePaged',
      params,
    },
  });
}
