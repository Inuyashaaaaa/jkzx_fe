export default {
  namespace: 'trade',
  state: {
    tableDataSource: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    bookEdit: false,
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        tableDataSource: action.payload.tableDataSource,
        pagination: action.payload.pagination,
      };
    },
  },
};
