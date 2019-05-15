import { getPageQuery } from '@/lib/utils';
import { initPagePermissions } from '@/services/role';
import { login, queryCaptcha, updateOwnPassword } from '@/services/user';
import { notification } from 'antd';
import router from 'umi/router';
import pageRouters from '../../config/router.config';

function setPagePermissions(user, roles, rolePagesPermission, pagePermissionTree, userPermissions) {
  function setPermission(pageTree, pageIds) {
    if (!pageTree || typeof pageTree !== 'object') {
      return;
    }
    const { id, children, pageName } = pageTree;
    if (pageIds.includes(id)) {
      userPermissions[pageName] = true;
    }
    if (children && children.length > 0) {
      children.forEach(child => setPermission(child, pageIds));
    }
  }
  let pageIds = [];
  rolePagesPermission.forEach(page => {
    const role = roles.find(r => r.id === page.roleId);
    page.roleName = (role && role.roleName) || '';
  });
  user.roles.forEach(role => {
    const hint = rolePagesPermission.find(rolePage => rolePage.roleName === role);
    if (hint) {
      pageIds = pageIds.concat(hint.pageComponentId);
    }
  });
  setPermission(pagePermissionTree, pageIds);
}

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
    status: undefined,
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
          yield put({
            type: 'showUpdatePassword',
          });
        } else if (userInfo.captcha) {
          yield put({
            type: 'queryCaptcha',
          });
        }

        return;
      }

      const permissionRsps = yield call(initPagePermissions, userInfo.token);

      const allRolePermissions = permissionRsps[0].data;
      const allPagePermissions = permissionRsps[1].data;
      const roles = permissionRsps[2].data;
      const permissions = {
        welcomePage: true,
      };

      setPagePermissions(
        userInfo,
        roles || [],
        allRolePermissions || [],
        allPagePermissions,
        permissions
      );

      yield put({
        type: 'user/saveCurrentUser',
        payload: {
          ...userInfo,
          roles,
          permissions,
        },
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
      if (!validateRedirect(appRoutes, redirect, permissions)) {
        redirect = '/welcome-page';
      }

      router.push({
        pathname: redirect,
      });
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
    },

    *updatePassword({ payload }, { call, put }) {
      const response = yield call(updateOwnPassword, payload);
      const error = (response.data && response.data.error) || '';
      if (error) {
        notification.error({
          message: `请求失败`,
          description: error.message,
        });
        return;
      }
      notification.success({
        message: `更新成功`,
      });
      yield put({
        type: 'hideUpdatePassword',
      });
    },
  },

  reducers: {
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
