import React, { memo, useEffect, useRef, useState } from 'react';
import { Button, Col, DatePicker, Row, Select, notification, Divider, Icon } from 'antd';
import _ from 'lodash';
import styles from './index.less';

export const themeNotification = diagnostics => {
  const description = (
    <>
      <p>数据异常明细</p>
      <ul className={styles.diagnosticsList}>
        {(diagnostics || []).slice(0, 5).map(item => (
          <li>{item.message}</li>
        ))}
      </ul>
    </>
  );
  if (_.get(diagnostics, 'length')) {
    notification.error({
      message: (
        <div style={{ fontSize: '14px', color: '#fff' }}>
          数据加载出现一些异常
          <Divider type="vertical" style={{ background: '#00E8E8' }} />
          <a style={{ color: '#00E8E8' }} href="/system-settings/operation-log?activeKey=error">
            查看详情
          </a>
        </div>
      ),
      description,
      className: styles.notificationWarp,
      icon: <Icon type="exclamation-circle" style={{ color: '#00E8E8' }} />,
    });
  }
};
