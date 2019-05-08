import { stringify } from 'qs';
import { login, queryCaptcha, permissions, updateOwnPassword } from '@/services/user';
import { initPagePermissions } from '@/services/role';
import { setAuthority, setToken, setPermissions } from '@/lib/utils/authority';
import { getPageQuery } from '@/lib/utils';
import { reloadAuthorized } from '@/lib/utils/Authorized';
import { notification } from 'antd';

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

// function findLoginRedirectPage(routers, userPermissions) {
//   let redirect = '';
//   function inner(router) {
//     const { name, path, routes } = router;
//     if (redirect) {
//       return;
//     }
//     if (name !== 'welcomePage' && userPermissions[name] && !routes) {
//       redirect = path;
//       return;
//     }
//     if (routes && routes.length > 0) {
//       routes.forEach(r => inner(r));
//     }
//   }
//   inner(routers);
//   return redirect;
// }

function validateRedirect(routers, redirect, userPermissions) {
  let valid = false;
  if (!redirect || redirect === '/user/login') {
    return false;
  }
  function inner(router) {
    const { name, path, routes } = router;
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
      const { data: userInfo } = response;

      if (response.error) {
        // yield put({
        //   type: 'loginFailed',
        //   payload: response.error,
        // });
        notification.error({
          message: `请求失败`,
          description: response.error.message,
        });
        if (userInfo && userInfo.expired) {
          yield put({
            type: 'showUpdatePassword',
          });
        }
        yield put({
          type: 'queryCaptcha',
        });
        return;
      }
      setToken(userInfo.token);
      // yield put({
      //   type: 'queryCurrentPagePermissions',
      //   payload: {
      //     ...userInfo,
      //   },
      // });

      const permissionInfo = yield call(initPagePermissions);
      const allRolePermissions = permissionInfo[0].data;
      const allPagePermissions = permissionInfo[1].data;
      const roles = permissionInfo[2].data;

      const newPermissions = Object.assign({}, permissions);
      Object.keys(newPermissions).forEach(key => (newPermissions[key] = false));
      // newPermissions.booking = true;
      setPagePermissions(
        userInfo,
        roles || [],
        allRolePermissions || [],
        allPagePermissions,
        newPermissions
      );

      yield put({
        type: 'changeLoginStatus',
        payload: { ...userInfo, permissions: newPermissions },
      });

      reloadAuthorized();

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
      if (!validateRedirect(appRoutes, redirect, newPermissions)) {
        // redirect = findLoginRedirectPage(appRoutes, newPermissions);
        redirect = '/welcome-page';
      }

      const nextQueryStr = stringify({
        _random: Math.random(),
      });

      window.location.href = `/?${nextQueryStr}/#${redirect || ''}`;
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

    // *queryCurrentPagePermissions({ payload }, { call, put }) {
    //   const permissionInfo = yield call(initPagePermissions);
    //   const allRolePermissions = permissionInfo[0].data;
    //   const allPagePermissions = permissionInfo[1].data;
    //   const roles = permissionInfo[2].data;

    //   const newPermissions = Object.assign({}, permissions);
    //   Object.keys(newPermissions).forEach(key => (newPermissions[key] = false));
    //   setPagePermissions(payload, roles || [], allRolePermissions || [], allPagePermissions, newPermissions);

    //   yield put({
    //     type: 'changeLoginStatus',
    //     payload: { ...payload, permissions: newPermissions },
    //   });

    //   reloadAuthorized();

    //   const urlParams = new URL(window.location.href);
    //   const params = getPageQuery();
    //   let { redirect } = params;
    //   if (redirect) {
    //     const redirectUrlParams = new URL(redirect);
    //     if (redirectUrlParams.origin === urlParams.origin) {
    //       redirect = redirect.substr(urlParams.origin.length);
    //       if (redirect.match(/^\/.*#/)) {
    //         redirect = redirect.substr(redirect.indexOf('#') + 1);
    //       }
    //     } else {
    //       window.location.href = redirect;
    //       return;
    //     }
    //   }

    //   const nextQueryStr = stringify({
    //     _random: Math.random(),
    //   });

    //   window.location.href = `/?${nextQueryStr}/#${redirect || ''}`;
    // },

    //  处理验证码
    // *getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },

    *logout(_, { put }) {
      setToken('');
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          roles: 'guest',
          username: '',
        },
      });

      reloadAuthorized();

      window.location.href = `/#/user/login?${stringify({
        redirect: window.location.href,
      })}`;
    },

    *updatePassword({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(updateOwnPassword, payload);
      console.log(response);
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
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.roles);
      // setToken(payload.token);
      setPermissions(payload.permissions);
      localStorage.setItem('login_name', payload.username);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        loginError: null,
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
