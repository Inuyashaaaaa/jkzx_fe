import { notification } from 'antd';

export function config() {
  return {
    onError(error) {
      notification.error({
        message: '抱歉，发送了未知错误',
        description: error + '',
      });
    },
  };
}
