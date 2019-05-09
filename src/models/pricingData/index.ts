export default {
  namespace: 'pricingData',

  state: {
    columnMeta: {
      columns: [],
      unionColumns: [],
    },
    tableData: [],
  },

  reducers: {
    setColumnMeta(state, { payload }) {
      return {
        ...state,
        columnMeta: typeof payload === 'function' ? payload(state.columnMeta) : payload,
      };
    },

    setTableData(state, { payload }) {
      return {
        ...state,
        tableData: typeof payload === 'function' ? payload(state.tableData) : payload,
      };
    },
  },
};
