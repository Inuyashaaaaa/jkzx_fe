export default {
  proxy: {
    '/api': {
      target: 'http://10.1.5.27:16016/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
