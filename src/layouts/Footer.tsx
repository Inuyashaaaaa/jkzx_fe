import GlobalFooter from '@/containers/GlobalFooter';
import { Icon, Layout } from 'antd';
import React, { Fragment } from 'react';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      // links={[
      //   {
      //     key: 'Pro 首页',
      //     title: 'Pro 首页',
      //     href: 'https://pro.ant.design',
      //     blankTarget: true,
      //   },
      //   {
      //     key: 'github',
      //     title: <Icon type="github" />,
      //     href: 'https://github.com/ant-design/ant-design-pro',
      //     blankTarget: true,
      //   },
      //   {
      //     key: 'Ant Design',
      //     title: 'Ant Design',
      //     href: 'https://ant.design',
      //     blankTarget: true,
      //   },
      // ]}ƒ
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> Tongyu All Rights Reserved 上海同余信息科技有限公司
          沪ICP备16043748号 v{require('@/defaultSettings').version}
        </Fragment>
      }
    />
  </Footer>
);

export default FooterView;
