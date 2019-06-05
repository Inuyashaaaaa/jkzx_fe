import { getUser, setUser } from '@/tools/authority';
import router from 'umi/router';
import _ from 'lodash';
import { updatePermission } from '@/services/permission';
import { PERMISSIONS } from '@/constants/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *replenish($, { put, call }) {
      const userInfo = getUser();
      if (_.isEmpty(userInfo)) {
        router.push('/user/login');
        return;
      }

      const updatedPermissionUserInfo = yield call(updatePermission, {
        ...userInfo,
        permissions: PERMISSIONS,
      });

      yield put({
        type: 'replenishUserInfo',
        payload: updatedPermissionUserInfo,
      });

      // eslint-disable-next-line no-underscore-dangle
      if (window._hmt && userInfo.username) {
        // eslint-disable-next-line no-underscore-dangle
        window._hmt.push(['_setUserTag', '7350', userInfo.username]);
      }
    },

    *replenishUserInfo(action, { put }) {
      const { payload: userInfo = {} } = action;

      yield put({
        type: 'saveUserData',
        payload: userInfo,
      });

      yield put({
        type: 'menu/initMenu',
        payload: userInfo,
      });
    },

    *cleanCurrentUser($, { put }) {
      yield put({
        type: 'saveUserData',
        payload: {},
      });
    },
  },

  reducers: {
    saveUserData(state, action) {
      setUser(action.payload);

      return {
        ...state,
        currentUser: action.payload,
      };
    },

    setRoles(state, action) {
      const currentUser = {
        ...state.userInfo,
        roles: action.payload || [],
      };

      setUser(currentUser);

      return {
        ...state,
        currentUser,
      };
    },
  },
};
