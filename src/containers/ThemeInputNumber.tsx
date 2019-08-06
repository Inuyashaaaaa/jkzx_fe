import styled from 'styled-components';
import React, { memo } from 'react';
import { InputNumber } from 'antd';

const ThemeInputNumberWrapper = styled.div`
  .ant-input-number {
    color: #00e8e8;
    background: transparent;
    border: 1px solid #05507b;
    border-radius: 3px;
    &:hover {
      border-color: #01c7d1;
    }
  }
`;

const ThemeInputNumber = memo(props => (
  <ThemeInputNumberWrapper>
    <InputNumber {...props}></InputNumber>
  </ThemeInputNumberWrapper>
));

export default ThemeInputNumber;
