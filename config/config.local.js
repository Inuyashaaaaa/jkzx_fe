// hongji 10.1.100.219
export default {
  proxy: {
    '/api': {
      target: 'http://10.1.100.191:16016/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
