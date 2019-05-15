import { getUser, setUser } from '@/lib/utils/authority';
import router from 'umi/router';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *replenishUserInfo(_, { put }) {
      const userInfo = getUser();

      if (!userInfo) {
        router.push('/user/login');
        return;
      }

      yield put({
        type: 'saveData',
        payload: userInfo,
      });
      yield put({
        type: 'menu/initMenu',
        payload: userInfo,
      });
    },

    *cleanCurrentUser(_, { put }) {
      setUser('');
      yield put({
        type: 'saveData',
        payload: {},
      });
    },

    *saveCurrentUser(action, { put }) {
      const { payload: userInfo = {} } = action;
      setUser(userInfo);

      yield put({
        type: 'menu/initMenu',
        payload: userInfo,
      });
    },
  },

  reducers: {
    saveData(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
