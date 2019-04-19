// hongji 10.1.100.219
export default {
  proxy: {
    '/api': {
      target: 'http://10.1.3.198:16016/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
