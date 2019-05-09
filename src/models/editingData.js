export default {
  namespace: 'tradeManagementBookEdit',

  state: {
    tableData: [],
  },

  reducers: {
    setTableData(state, { payload }) {
      if (typeof payload === 'function') {
        return {
          ...state,
          tableData: payload(state.tableData),
        };
      }
      return {
        ...state,
        tableData: payload,
      };
    },
  },
};
