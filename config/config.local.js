export default {
  history: 'hash',
  proxy: {
    '/api': {
      target: 'http://10.1.5.41/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
