export default {
  namespace: 'chartTalkModel',
  state: {
    instrumentId: '510050.SH',
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
