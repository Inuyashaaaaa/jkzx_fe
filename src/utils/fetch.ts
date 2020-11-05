import request from '@/utils/request';
import { createFetch } from '@/__apis__/request';

const fetch = createFetch(async options => {
  const { url, method, params, extra } = options;

  const getPrefix = () => {
    if (process.env.NODE_ENV === 'production') {
      return '';
    }
    if (extra && extra.mock) {
      return '';
    }
    return '/api';
  };

  const getUrl = () => {
    if (extra && extra.mock) {
      return url;
    }

    const baseUrl = url
      .split('/')
      .filter(item => !item.startsWith('method='))
      .join('/');

    return baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
  };

  const getRpcMethod = () => {
    if (extra && extra.mock) {
      return '';
    }

    const methodStrItem = url.split('/').find(item => item.startsWith('method='));
    if (!methodStrItem) {
      throw new Error(
        '自动化接口格式不符合规范 eg：document-service/api/rpc/method=queryDailyTradeReports',
      );
    }

    const [, rpcMethod] = methodStrItem.split('=');
    return rpcMethod;
  };

  return request(getUrl(), {
    method,
    data: {
      method: getRpcMethod(),
      params,
    },
    prefix: getPrefix(),
  });
});

export { fetch };
