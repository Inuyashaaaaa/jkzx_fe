import styled from 'styled-components';
import React, { memo } from 'react';
import { Button } from 'antd';

const ThemeButtonWrap = styled.div`
  .ant-btn {
    border-radius: 3px;
    background: #1594d0;
    font-size: 16px;
  }
`;

const ThemeButton = memo(props => (
  <ThemeButtonWrap>
    <Button {...props}></Button>
  </ThemeButtonWrap>
));

export default ThemeButton;
