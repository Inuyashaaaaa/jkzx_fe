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
    .ant-input-number-handler-wrap {
      border-left: 1px solid rgba(2, 158, 179, 1);
      .ant-input-number-handler-up {
        background-color: rgba(4, 83, 127, 1);
        .ant-input-number-handler-up-inner {
          color: rgba(2, 158, 179, 1);
        }
        &:hover {
          background: rgba(0, 202, 222, 1);
          .ant-input-number-handler-up-inner {
            color: white;
          }
        }
      }
      .ant-input-number-handler-down {
        background-color: rgba(4, 83, 127, 1);
        border-top: 1px solid rgba(2, 158, 179, 1);
        .ant-input-number-handler-down-inner {
          color: rgba(2, 158, 179, 1);
        }
        &:hover {
          background: rgba(0, 202, 222, 1);
          .ant-input-number-handler-down-inner {
            color: white;
          }
        }
      }
    }
  }
`;

const ThemeInputNumber = memo(props => (
  <ThemeInputNumberWrapper>
    <InputNumber {...props}></InputNumber>
  </ThemeInputNumberWrapper>
));

export default ThemeInputNumber;
