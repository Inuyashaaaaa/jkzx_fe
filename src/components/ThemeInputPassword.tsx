import styled from 'styled-components';
import React, { memo } from 'react';
import classnames from 'classnames';
import { Input } from 'antd';

// eslint-disable-next-line
const imgPath = require('@/assets/4.png');

const ThemeInputPasswordWrap = styled.div`
  .ant-input {
    border: 1px solid #05507b;
    background: rgba(27, 38, 80, 1);
    border-radius: 3px;
    color: #00e8e8;
    &:hover {
      border-color: #01c7d1;
    }
  }
`;

const ThemeInputPassword = memo(props => {
  const { dropdownClassName } = props;
  return (
    <ThemeInputPasswordWrap>
      <Input.Password {...props} />
    </ThemeInputPasswordWrap>
  );
});

export default ThemeInputPassword;
