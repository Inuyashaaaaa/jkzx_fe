import { getUser, setUser } from '@/lib/utils/authority';
import router from 'umi/router';

export default {
  namespace: 'user',

  state: {
    list: [],
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

    *saveCurrentUser(action, { put }) {
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
  },

  reducers: {
    saveUserData(state, action) {
      setUser(action.payload);

      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
