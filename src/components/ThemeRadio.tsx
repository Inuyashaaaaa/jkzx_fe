import styled from 'styled-components';
import React, { memo } from 'react';
import classnames from 'classnames';
import { Radio } from 'antd';

const ThemeRadioWrap = styled.div`
  .ant-radio-button-wrapper {
    background: transparent;
    border-color: #1bc1ff;
  }
  .ant-radio-button-wrapper-checked {
    background: #1bc1ff;
    color: #fff;
  }
  .ant-radio-button-wrapper:last-child {
    border-radius: 0 3px 3px 0;
  }
  .ant-radio-button-wrapper:first-child {
    border-radius: 3px 0 0 3px;
  }
`;

const ThemeRadio = memo(props => (
  <ThemeRadioWrap>
    <Radio {...props}></Radio>
  </ThemeRadioWrap>
));

ThemeRadio.Group = memo(props => (
  <ThemeRadioWrap>
    <Radio.Group {...props} />
  </ThemeRadioWrap>
));
ThemeRadio.Button = Radio.Button;

export default ThemeRadio;
