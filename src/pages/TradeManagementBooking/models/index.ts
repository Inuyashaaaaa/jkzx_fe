export default {
  namespace: 'tradeManagementBooking',

  state: {
    tableData: [],
  },

  reducers: {
    setTableData(state, { payload }) {
      return {
        ...state,
        tableData: typeof payload === 'function' ? payload(state.tableData) : payload,
      };
    },
  },
};
