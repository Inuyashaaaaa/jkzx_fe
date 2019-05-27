import { getUser, setUser } from '@/tools/authority';
import router from 'umi/router';
import _ from 'lodash';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *replenish($, { put }) {
      const userInfo = getUser();
      if (_.isEmpty(userInfo)) {
        router.push('/user/login');
        return;
      }

      yield put({
        type: 'replenishUserInfo',
        payload: userInfo,
      });
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
  },
};
