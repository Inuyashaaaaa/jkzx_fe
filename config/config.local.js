export default {
  proxy: {
    '/api': {
      target: 'http://10.1.100.243:16016/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/api/terminal-service': {
      target: 'http://10.1.2.75:18001/',
      changeOrigin: true,
      pathRewrite: { '^/api/terminal-service': '' },
    },
  },
};
