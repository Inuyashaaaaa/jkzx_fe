import React, { PureComponent, memo } from 'react';
import { ConfigProvider, Empty, Row } from 'antd';
import Header from './pages/InstrumentId/Header';
import styles from './Layout.less';

const Layout = memo(props => (
  <ConfigProvider
    renderEmpty={className => {
      console.log(className);
      return (
        <div style={{ padding: '1px 0', textAlign: 'center' }}>
          {className === 'Select' ? '暂无匹配' : '暂无数据'}
        </div>
      );
    }}
  >
    <div className={styles.wrap} {...props}></div>
  </ConfigProvider>
));

export default Layout;
