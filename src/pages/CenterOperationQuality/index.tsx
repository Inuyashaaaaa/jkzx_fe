import React, { memo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Col, Row } from 'antd';
import ThemeTabs from '@/containers/ThemeTabs';
import MarketSize from './MarketSize';
import MarketStructure from './MarketStructure/index';
import MarketConcentration from './MarketConcentration';
import Linkage from './Linkage/index';

const { TabPane } = ThemeTabs;

const BigTitle = styled.div`
  font-size: 22px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
`;

const CenterOperationQuality = () => (
  <>
    <Row type="flex" justify="start" gutter={14} style={{ marginBottom: 30 }}>
      <Col>
        <BigTitle>市场运行质量</BigTitle>
      </Col>
    </Row>
    <ThemeTabs defaultActiveKey="1" type="card" animated={false}>
      <TabPane tab="市场规模" key="1">
        <MarketSize />
      </TabPane>
      <TabPane tab="市场结构" key="2">
        <MarketStructure />
      </TabPane>
      <TabPane tab="市场集中度" key="3">
        <MarketConcentration />
      </TabPane>
      <TabPane tab="场内外联动" key="4">
        <Linkage />
      </TabPane>
    </ThemeTabs>
  </>
);

export default CenterOperationQuality;
