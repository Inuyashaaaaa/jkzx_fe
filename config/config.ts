// https://umijs.org/config/
import { defineConfig } from 'umi';
import settings from './settings';
import path from 'path';

export default defineConfig({
  title: settings.title,
  hash: true,
  antd: {},
  dva: {
    hmr: true,
    immer: true,
    skipModelValidate: true,
  },
  locale: {
    default: 'zh-CN',
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/page-loading/index',
  },
  targets: {
    ie: 11,
  },
  ignoreMomentLocale: true,
  chainWebpack: (memo) => {
    memo.resolve.alias.set('~', path.join(process.cwd(), 'node_modules'));
  },
});
