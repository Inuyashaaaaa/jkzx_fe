import React, { memo, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Col, Row } from 'antd';
import ThemeTabs from '@/containers/ThemeTabs';
import { Form2 } from '@/containers';
import InfectionRisk from './InfectionRisk';
import ControlRisk from './ControlRisk';

const { TabPane } = ThemeTabs;

const BigTitle = styled.div`
  font-size: 22px;
  font-weight: 400;
  color: rgba(246, 250, 255, 1);
  line-height: 32px;
`;
const CenterRiskMonitoring = () => (
  <>
    <Row type="flex" justify="start" gutter={14} style={{ marginBottom: 30 }}>
      <Col>
        <BigTitle>风险监测 </BigTitle>
      </Col>
    </Row>
    <ThemeTabs defaultActiveKey="1" type="card" animated={false}>
      <TabPane tab="操纵风险" key="1">
        <ControlRisk />
      </TabPane>
      <TabPane tab="子公司传染风险" key="2">
        <InfectionRisk />
      </TabPane>
    </ThemeTabs>
  </>
);

export default CenterRiskMonitoring;
