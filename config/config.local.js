// hongji 10.1.100.219
// wuyongbing 10.1.100.224
// http://10.1.2.60:16016/
export default {
  proxy: {
    '/api': {
      target: 'http://10.1.3.197:16016/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
