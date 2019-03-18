import { setAuthority } from '@/lib/utils/authority';
import { reloadAuthorized } from '@/lib/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    // *submit({ payload }, { call, put }) {
    // const response = yield call(fakeRegister, payload);
    // yield put({
    //   type: 'registerHandle',
    //   payload: response,
    // });
    // },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
