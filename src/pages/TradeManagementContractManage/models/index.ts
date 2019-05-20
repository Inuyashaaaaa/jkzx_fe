export default {
  namespace: 'tradeManagementContractManage',
  state: {
    activeTabKey: 'contractManagement',
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
    initKey(state, action) {
      console.log(action);
      return {
        ...state,
        activeTabKey: action.payload,
      };
    },
  },
};
