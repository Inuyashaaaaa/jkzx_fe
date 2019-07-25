const { stylelint } = require('@umijs/fabric');

module.exports = {
  ...stylelint,
  rules: {
    ...stylelint.rules,
    'declaration-empty-line-before': null,
  },
};
