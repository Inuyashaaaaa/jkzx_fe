import imgPath from '@/assets/touxiang.png';
import { ModelNameSpaces, RootStore } from '@/types';
import { Popconfirm } from 'antd';
import { useSelector } from 'dva';
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
    font-size: 18px;
    font-weight: bold;
    color: rgba(197, 212, 231, 1);
    line-height: 32px;
    text-align: center;
  }
`;

const User = memo(() => {
  const { userinfo } = useSelector((state: RootStore) => {
    return state[ModelNameSpaces.User];
  });

  const textLogout = '确定要退出登录吗？';
  const confirm = async () => {};

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
      <p>{userinfo.username}</p>
    </AdminWrap>
  );
});

export default User;
