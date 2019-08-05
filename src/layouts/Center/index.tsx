import React, { memo } from 'react';
import Content from './Content';
import Layout from './Layout';
import Sider from './Sider';

const ChartTalk = memo(props => (
  <Layout>
    <Sider></Sider>
    <Content>{props.children}</Content>
  </Layout>
));

export default ChartTalk;
