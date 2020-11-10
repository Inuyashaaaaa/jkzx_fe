import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import React, { memo } from 'react';
import styled from 'styled-components';

const ThemeInputWrap = styled.div`
  .ant-input {
    border: 1px solid #05507b;
    background: rgba(27, 38, 80, 1);
    border-radius: 3px;
    color: #00e8e8;
    font-size: 16px;
    &:hover {
      border-color: #01c7d1;
    }
  }
`;

const ThemeInput = memo<InputProps>(props => {
  return (
    <ThemeInputWrap>
      <Input {...props}></Input>
    </ThemeInputWrap>
  );
});

export default ThemeInput;
