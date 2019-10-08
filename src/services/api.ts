import fetch from 'dva/fetch';
import { HOST_TEST } from '@/constants/global';
import request from '@/tools/request';

// const apiHost = `${window.location.protocol}//${
//   process.env.NODE_ENV === 'development' ? '10.1.100.210' : window.location.hostname
// }`;

export async function methodInfoList(params = {}) {
  return request(`${HOST_TEST}auth-service/api/method/list`, {
    method: 'GET',
    passToken: true,
  });
}

export async function downloadApiDoc(params = {}) {
  return request(`${HOST_TEST}auth-service/bct/download/doc`, {
    method: 'GET',
    passToken: true,
    miniType: 'text',
  });
}

export async function apiPdf(params = {}) {
  return fetch(
    `http://${process.env.NODE_ENV === 'development' ? 'localhost' : '10.1.5.28'}:7001/api/pdf`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(params),
    },
  )
    .then(rsp => {
      if (rsp.status === 200) {
        return rsp.blob();
      }
      throw new Error();
    })
    .then(blob => ({
      data: window.URL.createObjectURL(blob),
      error: false,
    }))
    .catch(error => ({
      error,
    }));
}
