import React, { memo } from 'react';
import { BackTop } from 'antd';
import DocumentTitle from 'react-document-title';
import Content from './Content';
import Layout from './Layout';
import Sider from './Sider';

const ChartTalk = memo(props => (
  <DocumentTitle title="场外报告库估值与风险监测系统">
    <Layout>
      <Sider></Sider>
      <Content>{props.children}</Content>
      <BackTop style={{ right: '10px', bottom: '10px' }} />
    </Layout>
  </DocumentTitle>
));

export default ChartTalk;
