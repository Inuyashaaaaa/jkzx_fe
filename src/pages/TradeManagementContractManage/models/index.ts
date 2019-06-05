import { PAGE_SIZE } from '@/constants/component';

const FIRST_ACTIVE_TAB_KEY = 'contractManagement';

export default {
  namespace: 'tradeManagementContractManage',
  state: {
    entryTabKey: null,
    activeTabKey: FIRST_ACTIVE_TAB_KEY,
    contractManagement: {
      tableDataSource: [],
      collapse: true,
      pagination: {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
      },
    },
    open: {
      tableDataSource: [],
      collapse: true,
      pagination: {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
      },
    },
    unwind: {
      tableDataSource: [],
      collapse: true,
      pagination: {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
      },
    },
    expiration: {
      tableDataSource: [],
      collapse: true,
      pagination: {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
      },
    },
    overlate: {
      tableDataSource: [],
      collapse: true,
      pagination: {
        current: 1,
        pageSize: PAGE_SIZE,
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
          ...state[activeTabKey],
          tableDataSource,
          pagination,
          pageSizeCurrent,
        },
      };
    },

    changeCollapse(state, action) {
      const { activeTabKey, collapse } = action.payload;
      return {
        ...state,
        [activeTabKey]: {
          ...state[activeTabKey],
          collapse,
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
