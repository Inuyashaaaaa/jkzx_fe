import React, { memo } from 'react';
import styled, { css } from 'styled-components';

const EndTip = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  font-size: 10px;
  font-weight: 300;
  color: rgba(246, 250, 255, 1);
  line-height: 1;
  ${props =>
    props.borderLeft &&
    css`
      border-left: 1px solid rgba(0, 232, 232, 0.5);
    `}
  ${props =>
    props.hookTopRight &&
    css`
      border: 1px solid rgba(0, 232, 232, 0.5);
      border-left: none;
    `}
`;

const EndTupText = styled.span`
  display: inline-block;
  width: 11px;
  margin: 0 6px;
`;

const Unit = memo(props => (
  <EndTip {...props}>
    <EndTupText>单位万元</EndTupText>
  </EndTip>
));

export default Unit;
