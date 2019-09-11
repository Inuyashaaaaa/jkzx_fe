import { message, Popconfirm } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import React, { memo } from 'react';
import styled from 'styled-components';

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

const User = props => {
  const { user } = props;

  const textLogout = '确定要退出登录吗？';
  const confirm = async () => {
    props.dispatch({
      type: 'login/logout',
      payload: {
        loginUrl: '/center/login',
        userId: _.get(user, 'currentUser.username'),
      },
    });
  };
  // eslint-disable-next-line
  const imgPath = require('@/assets/touxiang.png');

  return (
    <AdminWrap>
      <Popconfirm
        placement="rightTop"
        title={textLogout}
        onConfirm={confirm}
        okText="确定"
        cancelText="取消"
      >
        <img src={imgPath} alt="头像"></img>
      </Popconfirm>
      <p>{_.get(user, 'currentUser.username')}</p>
    </AdminWrap>
  );
};

export default memo(
  connect(({ login, loading, user }) => ({
    user,
    login,
    submitting: loading.effects['login/login'],
  }))(User),
);
