import { BackTop } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo, useEffect } from 'react';
import DocumentTitle from 'react-document-title';
import Content from './components/content';
import Layout from './components/layout';
import Sider from './components/sider';

const ChartTalk = props => {
  sessionStorage.setItem('lastTime', new Date().getTime());
  let currentTime = new Date().getTime();
  const timeOut = 2 * 60 * 60 * 1000;
  const { user } = props;
  let timer;

  const operateTimeOut = () => {
    currentTime = new Date().getTime();
    const lastTime = sessionStorage.getItem('lastTime');
    if (currentTime - lastTime > timeOut) {
      window.clearInterval(timer);
      props.dispatch({
        type: 'login/logout',
        payload: {
          loginUrl: '/center/login',
          userId: _.get(user, 'currentUser.username'),
        },
      });
    }
  };

  const onClick = () => {
    sessionStorage.setItem('lastTime', new Date().getTime());
  };

  useEffect(() => {
    timer = window.setInterval(operateTimeOut, 1000);
  }, []);

  return (
    <DocumentTitle title="场外报告库估值与风险监测系统">
      <Layout onClick={onClick}>
        <Sider></Sider>
        <Content>{props.children}</Content>
        <BackTop style={{ right: '10px', bottom: '10px' }} />
      </Layout>
    </DocumentTitle>
  );
};

export default memo(
  connect(({ login, user }) => ({
    user,
    login,
  }))(ChartTalk),
);
