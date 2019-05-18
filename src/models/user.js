import { getUser, setUser } from '@/utils/authority';
import router from 'umi/router';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *replenish(_, { put }) {
      const userInfo = getUser();
      if (!userInfo) {
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

    *cleanCurrentUser(_, { put }) {
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
