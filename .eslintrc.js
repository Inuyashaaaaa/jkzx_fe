const { eslint } = require('@umijs/fabric');

module.exports = {
  ...eslint,
  rules: {
    ...eslint.rules,
    'eslint-comments/disable-enable-pair': 0,
    'eslint-comments/no-unlimited-disable': 0,
  },
};
