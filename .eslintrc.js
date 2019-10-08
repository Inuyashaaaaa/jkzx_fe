const { eslint } = require('@umijs/fabric');

module.exports = {
  ...eslint,
  globals: {
    ...eslint.globals,
    cy: true,
  },
  rules: {
    ...eslint.rules,
    'eslint-comments/disable-enable-pair': 0,
    'eslint-comments/no-unlimited-disable': 0,
  },
};
