import React, { PureComponent, memo, useEffect, useCallback } from 'react';
import { ConfigProvider, Empty, Row } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import router from 'umi/router';
import Header from '../../pages/CenterUnderlying/Header';
import styles from './Layout.less';
import ThemeButton from '@/containers/ThemeButton';
import { getUser, setUser } from '@/tools/authority';

const Layout = props => {
  const { dispatch } = props;

  useEffect(() => {
    let beforeUnloadTime = 0;
    let gapTime = 0;
    window.onunload = () => {
      gapTime = new Date().getTime() - beforeUnloadTime;
      if (gapTime <= 5) {
        setUser({});
      }
    };
    window.onbeforeunload = () => {
      beforeUnloadTime = new Date().getTime();
    };
  }, []);

  useEffect(() => {
    dispatch({
      type: 'user/replenish',
      payload: {
        loginUrl: '/center/login',
        skipMenu: false,
      },
    });
  }, []);

  useEffect(() => {
    if (_.get(props, 'user.currentUser.username')) {
      dispatch({
        type: 'centerDate/getDate',
        payload: {},
      });
    }
  }, [_.get(props, 'user.currentUser.username')]);

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
