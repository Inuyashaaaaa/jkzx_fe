import moment from 'moment';
import { STRIKE_TYPE_ENUM } from '@/constants/global';

export default {
  namespace: 'centerUnderlying',
  state: {
    data: {},
    instrumentId: '510050.SH',
    activeKey: '0',
    strikeType: STRIKE_TYPE_ENUM.STRIKE_PERCENTAGE,
    fetchStrikeType: STRIKE_TYPE_ENUM.STRIKE_PERCENTAGE,
    reportDate: moment('2019-08-08'),
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...(typeof payload === 'function' ? payload(state.tableData) : payload),
      };
    },
  },
};
