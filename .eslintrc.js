module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:compat/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    APP_TYPE: true,
    page: true,
  },
  rules: {
    'import/no-extraneous-dependencies': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/jsx-wrap-multilines': 0,
    'react/require-default-props': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'import/no-unresolved': [2, { ignore: ['^@/', '^umi/'] }],
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: ['**/tests/**.js', '/mock/**.js', '**/**.test.js', 'doczrc.js'],
      },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'import/prefer-default-export': 0,
    'arrow-body-style': 0,
    'no-nested-ternary': 0,
    camelcase: 1,
    'no-unused-expressions': 0,
    'consistent-return': 1,
    'no-param-reassign': 1,
    'prefer-template': 1,
    'react/no-array-index-key': 1,
    'consistent-return': 0,
    'linebreak-style': 0,
    'no-return-assign': 1,
  },
  settings: {
    polyfills: ['fetch', 'promises', 'url'],
  },
};
