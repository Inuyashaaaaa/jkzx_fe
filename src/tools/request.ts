/* eslint-disable */
import { notification } from 'antd';
import fetch from 'dva/fetch';
import hash from 'hash.js';
import { router } from 'umi';
import _ from 'lodash';
import { getToken } from './authority';
import { messageDom, icon } from './notificationDom';
import styles from '../styles/notification.less';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '服务器无法回应。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  const error = new Error(errortext);
  error.code = response.status;
  throw error;
};

function checkData(data) {
  // 获取资源的接口，网络如果无错误就当是成功返回
  if (typeof data === 'string') {
    return {
      error: false,
      data,
      raw: data,
    };
  }

  // restful api style
  if (!data.jsonrpc) {
    return {
      error: false,
      data,
      raw: data,
    };
  }

  if (data.error) {
    const { code, message } = data.error;
    // 常规错误处理
    const error = new Error(message);
    error.code = code;
    throw error;
  }

  return {
    error: false,
    data: data.result,
    raw: data,
  };
}

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

const gotoLogin = _.debounce(() => {
  const urlParams = new URL(window.location.href);
  const { pathname } = urlParams;
  if (pathname.split('/')[1] === 'center') {
    router.push('/center/login');
    return;
  }
  router.push('/user/login');
}, 100);

const convertResponse = (options, response) => {
  const { miniType } = options;
  // const contentTypeMapStr = response.headers.get('content-type');
  // const [noop, contentType] = contentTypeMapStr.match(/application\/(.*?);/) || [];

  if (miniType) {
    return response[miniType]();
  }

  if (response.status === 204 || options.method === 'DELETE') {
    return response.text();
  }
  return response.json();
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, _options = {}, passError = false) {
  const { token, passToken, ...options } = _options;

  passError = true;

  if (!passToken && !(token || getToken())) {
    passError = true;
    gotoLogin();
  }

  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };
  const { onCatch, expirys, ...useOptions } = options;
  const newOptions = { ...defaultOptions, ...useOptions };

  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE' ||
    newOptions.method === 'PATCH'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token || getToken()}`,
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${token || getToken()}`,
        ...newOptions.headers,
      };
    }
  }

  if (expirys) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(convertResponse.bind(this, newOptions))
    .then(checkData)
    .catch(
      onCatch ||
        (error => {
          const { code, message } = error;
          const urlParams = new URL(window.location.href);
          const { pathname } = urlParams;
          const isCenter = pathname.split('/')[1] === 'center';
          const failAction = { error };

          if (!passError) {
            if (code === 107) {
              if (isCenter) {
                notification.error({
                  message: messageDom({ reLogin: true }),
                  className: styles.notificationWarp,
                  // duration: null,
                  icon,
                });
              } else {
                notification.error({
                  message: '登陆信息已过期，请重新登陆,3秒后自动跳转登录页',
                });
              }
              setTimeout(() => {
                const urlParams = new URL(window.location.href);
                const { pathname } = urlParams;
                const loginUrl =
                  pathname.split('/')[1] === 'center' ? '/center/login' : '/user/login';
                // @HACK
                window.g_app._store.dispatch({
                  type: 'login/logout',
                  payload: {
                    loginUrl,
                    routerPush: true,
                  },
                });
              }, 3000);

              return failAction;
            }
            if (isCenter) {
              notification.error({
                message: messageDom({}),
                description: message,
                className: styles.notificationWarp,
                // duration: null,
                icon,
              });
            } else {
              notification.error({
                message: '请求失败',
                description: message,
              });
            }
          }

          if (code === 401) {
            notification.error({
              message: '3秒后自动跳转登录页',
            });
            setTimeout(() => {
              const urlParams = new URL(window.location.href);
              const { pathname } = urlParams;
              const loginUrl =
                pathname.split('/')[1] === 'center' ? '/center/login' : '/user/login';
              // @HACK
              window.g_app._store.dispatch({
                type: 'login/logout',
                payload: {
                  loginUrl,
                  routerPush: true,
                },
              });
            }, 3000);

            return failAction;
          }

          return failAction;
        }),
    );
}

window.request = request;
