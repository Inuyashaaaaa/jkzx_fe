// hongji 10.1.100.219
export default {
  proxy: {
    '/api': {
      target: 'http://localhost:16016/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
