export default {
  history: 'hash',
  proxy: {
    '/api': {
      target: 'http://10.1.5.16:16016/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
