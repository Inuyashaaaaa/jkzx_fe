import moment from 'moment';
import { refTradeDateByOffsetGet } from '@/services/volatility';

export default {
  namespace: 'centerDate',

  state: {
    date: null,
    scenarioData: null,
    dates: [null, null],
  },
  effects: {
    *getDate(action, { put }) {
      const { data, error } = yield refTradeDateByOffsetGet({
        offset: -2,
      });
      if (error) return;
      yield put({
        type: 'save',
        payload: {
          date: moment(data),
          dates: [moment(data).subtract(1, 'd'), moment(data)],
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
