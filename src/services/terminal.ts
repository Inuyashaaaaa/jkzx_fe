import { HOST_TEST } from '@/constants/global';
import request from '@/tools/request';

export async function getInstrumentRollingVol(params) {
  return request(`${HOST_TEST}terminal-service`, {
    method: 'POST',
    body: {
      method: 'getInstrumentRollingVol',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getInstrumentVolCone(params) {
  return request(`${HOST_TEST}terminal-service`, {
    method: 'POST',
    body: {
      method: 'getInstrumentVolCone',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}

export async function getInstrumentRealizedVol(params) {
  return request(`${HOST_TEST}terminal-service`, {
    method: 'POST',
    body: {
      method: 'getInstrumentRealizedVol',
      params,
      jsonrpc: '2.0',
      id: 1,
    },
  });
}
