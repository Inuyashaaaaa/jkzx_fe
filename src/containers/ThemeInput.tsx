import styled from 'styled-components';
import React, { memo } from 'react';
import classnames from 'classnames';
import { Input } from 'antd';

// eslint-disable-next-line
const imgPath = require('@/assets/4.png');

const ThemeInputWrap = styled.div`
  .ant-input {
    border: 1px solid #05507b;
    background: transparent;
    border-radius: 3px;
    color: #00e8e8;
    &:hover {
      border-color: #01c7d1;
    }
  }
`;

const ThemeInput = memo(props => {
  const { dropdownClassName } = props;
  return (
    <ThemeInputWrap>
      <Input {...props}></Input>
    </ThemeInputWrap>
  );
});

export default ThemeInput;
