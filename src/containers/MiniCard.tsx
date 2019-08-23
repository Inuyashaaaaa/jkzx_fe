import { Col, Row, Statistic } from 'antd';
import classnames from 'classnames';
import React, { memo } from 'react';
import styled, { css } from 'styled-components';

const MiniCardWrap = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-around;
  width: 150px;
  height: 80px;
  padding: 0 10px 5px 10px;
  color: #fff;
  border: 1px solid #01c7d1;
  border-radius: 3px;
  opacity: 0.4;
  cursor: pointer;
  font-size: 13px;

  ${props =>
    props.active &&
    css`
      background: #044275;
      opacity: 1;
    `}
`;

const Stick = styled.div`
  position: absolute;
  left: 50%;
  height: 100%;
  border-right: 1px solid #05507b;
`;

const MiniCard = memo(props => {
  const { title, value, active, imageUrls = [], onClick } = props;

  return (
    <MiniCardWrap active={active} onClick={onClick}>
      <Row type="flex" justify="center">
        <Col>{title}</Col>
      </Row>
      <Row type="flex" justify="center" gutter={20} style={{ position: 'relative' }}>
        {imageUrls.length && imageUrls.length === 2 && (
          <>
            <Col>
              <img src={imageUrls[0]} alt="缩略图1" />
            </Col>
            <Stick></Stick>
            <Col>
              <img src={imageUrls[1]} alt="缩略图2" />
            </Col>
          </>
        )}
        {imageUrls.length && imageUrls.length === 1 && (
          <img style={{ width: 100 }} src={imageUrls[0]} alt="缩略图1" />
        )}
      </Row>
    </MiniCardWrap>
  );
});

export default MiniCard;
