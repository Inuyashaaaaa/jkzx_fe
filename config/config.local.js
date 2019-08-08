export default {
  proxy: {
    '/api': {
      target: 'http://192.168.1.106:16016/',
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
