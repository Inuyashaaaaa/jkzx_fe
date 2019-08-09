import React, { memo } from 'react';
import { BackTop } from 'antd';
import Content from './Content';
import Layout from './Layout';
import Sider from './Sider';

const ChartTalk = memo(props => (
  <Layout>
    <Sider></Sider>
    <Content>{props.children}</Content>
    <BackTop style={{ right: '10px', bottom: '10px' }} />
  </Layout>
));

export default ChartTalk;
