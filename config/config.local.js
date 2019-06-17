export default {
  proxy: {
    '/api': {
      target: 'http://10.1.109.199:16016/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
