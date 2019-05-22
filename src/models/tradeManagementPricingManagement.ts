export default {
  namespace: 'tradeManagementPricingManagement',

  state: {
    tableDataSource: [],
  },

  reducers: {
    setTableDataSource(state, { payload }) {
      return {
        ...state,
        tableDataSource: typeof payload === 'function' ? payload(state.tableDataSource) : payload,
      };
    },
  },
};
