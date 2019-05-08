export default {
  namespace: 'tradeManagementContractManagement',
  state: {
    activeTabKey: 'contractManagement',
  },
  reducers: {
    onTabChange(state, action) {
      const {
        payload: { key },
      } = action;
      state.activeTabKey = key;
    },
  },
};
