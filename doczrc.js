import path from 'path';

export default {
  title: 'Termites-App',
  src: './src',
  files: '**/*.mdx',
  dest: './cdocs',
  typescript: true,
  codeSandbox: false,
  onCreateWebpackChain: config => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));

    config.module
      .rule('less')
      .test(/\.less$/)
      .use('style')
      .loader('style-loader')
      .end()
      .use('css')
      .loader('css-loader')
      .end()
      .use('less')
      .loader('less-loader')
      .options({
        javascriptEnabled: true,
      })
      .end();

    config.module
      .rule('ts')
      .use('babel-loader')
      .tap(options => ({
        ...options,
        plugins: [
          [
            // eslint-disable-next-line global-require
            require('babel-plugin-import'),
            {
              libraryName: 'antd',
              libraryDirectory: 'es',
              style: true,
            },
          ],
          ...options.plugins,
        ],
      }));

    return config;
  },
  filterComponents: files => files.filter(filepath => /w*.(js|jsx|ts|tsx)$/.test(filepath)),
  menu: ['Home', 'App', 'Layouts', 'Pages', 'Containers', 'Components'],
  themeConfig: {
    colors: {
      primary: '#1890ff',
    },
  },
};
