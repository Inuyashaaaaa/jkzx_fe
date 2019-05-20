export default {
  namespace: 'trade',
  state: {
    contractManagement: {
      tableDataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
    open: {
      tableDataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
    unwind: {
      tableDataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
    expiration: {
      tableDataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
    overlate: {
      tableDataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    },
    // activeTabKey: 'contractManagement',
  },
  reducers: {
    save(state, action) {
      const { activeTabKey, tableDataSource, pagination } = action.payload;
      return {
        ...state,
        [activeTabKey]: {
          tableDataSource,
          pagination,
        },
      };
    },
  },
};
