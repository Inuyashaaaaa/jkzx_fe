export default {
  namespace: 'preRouting',

  state: {
    location: null,
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        location: action.payload,
      };
    },
  },
};
