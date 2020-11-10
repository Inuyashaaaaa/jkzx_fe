import { BackTop } from 'antd';
import React from 'react';
import DocumentTitle from 'react-document-title';
import Content from './components/content';
import Layout from './components/layout';
import Sider from './components/sider';

const Center: React.FC<{}> = (props) => {
  return (
    <DocumentTitle title="场外报告库估值与风险监测系统">
      <Layout>
        <Sider></Sider>
        <Content>{props.children}</Content>
        <BackTop style={{ right: '10px', bottom: '10px' }} />
      </Layout>
    </DocumentTitle>
  );
};

export default Center;
