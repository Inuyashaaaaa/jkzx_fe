import { ConfigProvider } from 'antd';
import React, { memo } from 'react';
import styles from './layout.less';

const Layout = memo((props) => {
  return (
    <ConfigProvider
      renderEmpty={(className) => (
        <div style={{ padding: '1px 0', textAlign: 'center' }}>
          {className === 'Select' ? '暂无匹配' : '暂无数据'}
        </div>
      )}
    >
      {/* <ThemeButton
        style={{ position: 'fixed', top: 10, right: 15, zIndex: 999 }}
        type="primary"
        onClick={handleJumpBCT}
      >
        进入BCT系统
      </ThemeButton> */}
      <div className={styles.wrap} {...props}></div>
    </ConfigProvider>
  );
});

export default Layout;
