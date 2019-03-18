import { HOST_TEST } from '@/constants/global';
import request from '@/lib/utils/request';

export async function trdBookList(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdBookList',
      params,
    },
  });
}

export async function trdTradeGet(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradeGet',
      params: {
        ...params,
        validTime: '2018-01-01T10:10:10',
        transactionTime: '2018-01-01T10:10:10',
      },
    },
  });
}

export async function trdTradeSearch(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradeSearch',
      params,
    },
  });
}

export async function trdTradeSearchPaged(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradeSearchPaged',
      params,
    },
  });
}

export async function trdTradeListByBook(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradeListByBook',
      params,
    },
  });
}

export async function trdTradeLCMEventList(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradeLCMEventList',
      params,
    },
  });
}

export async function trdExpiringTradeList(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdExpiringTradeList',
      params,
    },
  });
}

export async function trdTradeListBySimilarTradeId(params = {}) {
  return request(`${HOST_TEST}trade-service/api/rpc`, {
    method: `POST`,
    body: {
      method: 'trdTradeListBySimilarTradeId',
      params,
    },
  });
}
