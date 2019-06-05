import { getPageQuery } from '@/tools';
import { login, queryCaptcha, updateOwnPassword } from '@/services/user';
import { notification } from 'antd';
import pageRouters from '../../config/router.config';
import router from 'umi/router';
import { updatePermission } from '@/services/permission';
import { PERMISSIONS } from '@/constants/user';

function validateRedirect(routers, redirect, userPermissions) {
  let valid = false;
  if (!redirect || redirect === '/user/login') {
    return false;
  }
  function inner(_router) {
    const { name, path, routes } = _router;
    if (valid) {
      return;
    }
    if (name !== 'welcomePage' && path === redirect && userPermissions[name]) {
      valid = !(routes && routes.length > 0);
      return;
    }
    if (routes && routes.length > 0) {
      routes.forEach(r => inner(r));
    }
  }
  inner(routers);
  return valid;
}

export default {
  namespace: 'login',

  state: {
    loginFormData: {},
    img: null,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      const { data: userInfo, error } = response;

      if (error) {
        notification.error({
          message: '请求失败',
          description: userInfo.message,
        });

        if (userInfo.expired) {
          // 首先设置一次用户信息，保存 token 内容到本地，因为修改密码接口需要 token
          yield put({
            type: 'user/saveUserData',
            payload: userInfo,
          });

          yield put({
            type: 'showUpdatePassword',
          });
        }

        yield put({
          type: 'queryCaptcha',
        });

        return;
      }

      const updatedPermissionUserInfo = yield call(updatePermission, {
        ...userInfo,
        permissions: PERMISSIONS,
      });

      yield put({
        type: 'user/replenishUserInfo',
        payload: updatedPermissionUserInfo,
      });

      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;

      // CROS 判断
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }

      const appRoutes = pageRouters.find(item => !!item.appRoute);
      if (!validateRedirect(appRoutes, redirect, updatedPermissionUserInfo.permissions)) {
        redirect = '/welcome-page';
      }

      router.push({
        pathname: redirect,
      });
      yield put({
        type: 'changeForm',
        payload: {},
      });

      // const nextQueryStr = stringify({
      //   _random: Math.random(),
      // });

      // window.location.href = `/?${nextQueryStr}/#${redirect || ''}`;
    },

    *queryCaptcha(_, { call, put }) {
      const response = yield call(queryCaptcha);

      yield put({
        type: 'setCaptcha',
        payload: {
          img: response,
        },
      });
    },

    *logout(_, { put }) {
      yield put({
        type: 'user/cleanCurrentUser',
      });

      router.push({
        pathname: '/user/login',
        query: {
          redirect: window.location.href,
        },
      });

      // window.location.href = `/#/user/login?${stringify({
      //   redirect: window.location.href,
      // })}`;
    },

    *updatePassword({ payload }, { call, put }) {
      const { error } = yield call(updateOwnPassword, payload);
      if (error) return;
      notification.success({
        message: `更新成功`,
      });
      yield put({
        type: 'queryCaptcha',
      });
      yield put({
        type: 'relogin',
      });
    },
  },

  reducers: {
    relogin(state) {
      return {
        ...state,
        showPasswordUpdate: false,
        loginFormData: {
          ...state.loginFormData,
          password: undefined,
          captcha: undefined,
        },
      };
    },

    changeForm(state, { payload }) {
      return {
        ...state,
        loginFormData: payload,
      };
    },

    loginFailed(state, { payload }) {
      return {
        ...state,
        loginError: payload,
      };
    },

    setCaptcha(state, { payload }) {
      return {
        ...state,
        img: payload.img,
        showImage: true,
      };
    },

    showUpdatePassword(state) {
      return {
        ...state,
        showPasswordUpdate: true,
      };
    },

    hideUpdatePassword(state) {
      return {
        ...state,
        showPasswordUpdate: false,
      };
    },
  },
};
