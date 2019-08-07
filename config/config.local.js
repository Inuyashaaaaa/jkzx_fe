export default {
  proxy: {
    '/api': {
      target: 'http://10.1.100.238:16016/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/api/data-service/api/rpc': {
      target: 'http://10.1.2.75:18001/',
      changeOrigin: true,
      pathRewrite: { '^/api/data-service/api/rpc': '' },
    },
  },
};
