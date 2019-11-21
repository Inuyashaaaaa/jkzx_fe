import React from 'react';
import { Divider, Icon } from 'antd';

export const messageDom = param => {
  const { reLogin } = param;
  if (reLogin) {
    return (
      <div style={{ fontSize: '14px', color: '#fff' }}>
        登陆信息已过期，请重新登陆，3秒后自动跳转登录页
      </div>
    );
  }
  return (
    <div style={{ fontSize: '14px', color: '#fff' }}>
      数据加载出现一些异常
      <Divider type="vertical" style={{ background: '#00E8E8' }} />
      <a style={{ color: '#00E8E8' }} href="/system-settings/operation-log?activeKey=error">
        查看详情
      </a>
    </div>
  );
};

export const icon = <Icon type="exclamation-circle" style={{ color: '#00E8E8' }} />;
