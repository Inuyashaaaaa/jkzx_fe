module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    cy: true,
  },
  rules: {
    'eslint-comments/disable-enable-pair': 0,
    'eslint-comments/no-unlimited-disable': 0,
  },
};
