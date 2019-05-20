const FIRST_ACTIVE_TAB_KEY = 'contractManagement';

export default {
  namespace: 'tradeManagementContractManage',
  state: {
    entryTabKey: null,
    activeTabKey: FIRST_ACTIVE_TAB_KEY,
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
  },
  reducers: {
    onTabChange(state, action) {
      const {
        payload: { key },
      } = action;
      return {
        ...state,
        activeTabKey: key,
      };
    },

    initKey(state) {
      return {
        ...state,
        activeTabKey: FIRST_ACTIVE_TAB_KEY,
      };
    },

    save(state, action) {
      const { activeTabKey, tableDataSource, pagination, pageSizeCurrent } = action.payload;
      return {
        ...state,
        [activeTabKey]: {
          tableDataSource,
          pagination,
          pageSizeCurrent,
        },
      };
    },

    setEntryTabKey(state, action) {
      return {
        ...state,
        entryTabKey: action.payload,
      };
    },
  },
};
