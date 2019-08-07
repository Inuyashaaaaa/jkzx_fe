import { Col, Row } from 'antd';
import React, { memo, useState } from 'react';
import { connect } from 'dva';
import MiniCard from '@/containers/MiniCard';

// eslint-disable-next-line
const imgPath = require('@/assets/1.png');
// eslint-disable-next-line
const imgPath2 = require('@/assets/2.png');
// eslint-disable-next-line
const imgPath3 = require('@/assets/5.png');
// eslint-disable-next-line
const imgPath4 = require('@/assets/10.png');

const Panels = props => {
  const { activeKey } = props;
  const setActiveKey = next => {
    if (activeKey === next) {
      return;
    }

    props.dispatch({
      type: 'centerUnderlying/setState',
      payload: {
        activeKey: next,
      },
    });
  };

  const setActiveKeyCache = next => {
    setActiveKey(next);
  };

  return (
    <Row type="flex" justify="start" gutter={20}>
      <Col>
        <MiniCard
          onClick={() => setActiveKeyCache('0')}
          title="历史波动率"
          active={activeKey === '0'}
          imageUrls={[imgPath, imgPath2]}
        ></MiniCard>
      </Col>
      <Col>
        <MiniCard
          onClick={() => setActiveKeyCache('1')}
          title="公允波动率"
          active={activeKey === '1'}
          imageUrls={[imgPath3]}
        ></MiniCard>
      </Col>
      <Col>
        <MiniCard
          onClick={() => setActiveKeyCache('2')}
          title="子公司波动率对比"
          active={activeKey === '2'}
          imageUrls={[imgPath4]}
        ></MiniCard>
      </Col>
    </Row>
  );
};

export default memo(
  connect(state => ({
    activeKey: state.centerUnderlying.activeKey,
  }))(Panels),
);
