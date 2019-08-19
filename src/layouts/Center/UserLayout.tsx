import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'dva';
import { Popconfirm, message } from 'antd';
import useLifecycles from 'react-use/lib/useLifecycles';
import _ from 'lodash';
import { getUser } from '@/tools/authority';

const AdminWrap = styled.div`
  position: absolute;
  bottom: 22px;
  left: 40px;
  img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
  p {
    font-size: 14px;
    font-family: PingFang-SC-Bold;
    font-weight: bold;
    color: rgba(197, 212, 231, 1);
    line-height: 32px;
    text-align: center;
  }
`;

const UserLayout = props => {
  const [user, setUser] = useState({});

  const textLogout = '确定要退出登录吗？';
  const confirm = async () => {
    props.dispatch({
      type: 'login/logout',
    });
    message.info('退出登录');
  };
  // eslint-disable-next-line
  const imgPath = require('@/assets/touxiang.png');

  useLifecycles(() => {
    const userInfo: any = getUser();
    setUser({
      pirture: imgPath,
      name: userInfo.username,
    });
  });
  return (
    <AdminWrap>
      <Popconfirm
        placement="rightTop"
        title={textLogout}
        onConfirm={confirm}
        okText="确定"
        cancelText="取消"
      >
        <img src={user.pirture} alt="头像"></img>
      </Popconfirm>
      <p>{user.name}</p>
    </AdminWrap>
  );
};

export default memo(
  connect(({ login, loading }) => ({
    login,
    submitting: loading.effects['login/login'],
  }))(UserLayout),
);
