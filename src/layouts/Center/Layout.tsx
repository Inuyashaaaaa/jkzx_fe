import React, { PureComponent, memo, useEffect, useCallback } from 'react';
import { ConfigProvider, Empty, Row } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Header from '../../pages/CenterUnderlying/Header';
import styles from './Layout.less';
import ThemeButton from '@/containers/ThemeButton';

const Layout = props => {
  const { dispatch } = props;
  useEffect(() => {
    dispatch({
      type: 'user/replenish',
      payload: {
        loginUrl: '/center/login',
        skipMenu: false,
      },
    });
    dispatch({
      type: 'centerDate/getDate',
      payload: {},
    });
  }, []);

  const handleJumpBCT = useCallback(() => {
    router.push({
      pathname: '/welcome-page',
      query: {
        fromCenter: true,
      },
    });
  });
  return (
    <ConfigProvider
      renderEmpty={className => (
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
};

export default memo(connect(state => state)(Layout));
