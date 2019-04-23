/* eslint-disable no-param-reassign */
import { isType } from '@/lib/utils';

const reducers = {
  switchUnwindModalVisible(state, { payload }) {
    return {
      ...state,
      unwindModalVisible: isType(payload, 'Boolean') ? payload : !state.unwindModalVisible,
    };
  },

  switchCurUnwindDataSourceItem(state, { payload }) {
    return {
      ...state,
      curUnwindDataSourceItem: payload,
    };
  },

  openUnwindModal(state, { payload: dataSourceItem }) {
    reducers.switchUnwindModalVisible(state, {});
    reducers.switchCurUnwindDataSourceItem(state, { payload: dataSourceItem });
  },

  changeDataSourceItem(state, { payload }) {
    return {
      ...state,
      curUnwindDataSourceItem: payload,
    };
  },
};

export default {
  namespace: 'bookEditControl',

  state: {
    curUnwindDataSourceItem: null,
    unwindModalVisible: false,
  },

  effects: {},

  reducers,
};
