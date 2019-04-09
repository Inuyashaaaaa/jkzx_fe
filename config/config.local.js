// hongji 10.1.100.219
// wuyongbing 10.1.100.224
export default {
  proxy: {
    '/api': {
      target: 'http://10.1.100.224:16016/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
