import { BackTop, Layout, Menu, Row, Button, Modal } from 'antd';
import _ from 'lodash';
import qs from 'qs';
import React, { memo, useCallback, useEffect, useState } from 'react';
import html2markdown from 'h2m';
import TextArea from 'antd/lib/input/TextArea';
import { methodInfoList } from '@/services/api';
import styles from './index.less';
import ServiceContent from './ServiceContent';
import ServiceMenu from './ServiceMenu';

const { SubMenu } = Menu;

const { Header, Content, Sider } = Layout;

const ApiDocs = memo(() => {
  const [mdStr, setMdStr] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState('');
  const [menus, setMenus] = useState([]);
  const [activeKey, setActiveKey] = useState();
  const [activeKeySource, setActiveKeySource] = useState('click');
  const [isMount, setIsMount] = useState(false);

  const updateApiDocs = async () => {
    const rsp = await methodInfoList();
    if (rsp.error) return;

    const inlineMenus = _.chain(rsp.data)
      .groupBy(item => item.service)
      .map((children, service) => ({
        name: service || '--',
        children: _.sortBy(children, item => item.method),
      }))
      .sortBy(item => item.name)
      .value();

    setMenus(inlineMenus);
    setData(_.sortBy(rsp.data, item => item.method));

    const { protocol, host, pathname, search, hash } = window.location;
    const query = qs.parse(search, { ignoreQueryPrefix: true });
    setActiveKey(query.activeKey ? query.activeKey : _.get(inlineMenus, '[0].children.[0].method'));
  };

  useEffect(() => {
    setIsMount(true);
    updateApiDocs();
  }, []);

  const handleMenuClick = useCallback(event => {
    setActiveKeySource('click');
    setActiveKey(event.key);
  });

  useEffect(() => {
    setTimeout(() => {
      if (!activeKey) return;
      const { protocol, host, pathname, search, hash } = window.location;
      const query = qs.parse(search, { ignoreQueryPrefix: true });
      query.activeKey = activeKey;
      window.history.pushState(
        null,
        null,
        `${protocol}//${host}${pathname}${qs.stringify(query, { addQueryPrefix: true })}${hash}`,
      );
    }, 0);
  }, [activeKey]);

  useEffect(() => {
    setTimeout(() => {
      if (activeKeySource === 'click') {
        const item = Array.from(document.getElementsByTagName('h1')).find(
          inlineItem => inlineItem.textContent === activeKey,
        );
        if (!item) return;
        item.scrollIntoView({});
      }
    }, 0);
  }, [activeKey, activeKeySource]);

  return (
    <Layout style={{ height: '100vh' }}>
      <Header className="header">
        <Row type="flex" justify="space-between">
          <div>
            <div className={styles.logo}></div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">v1</Menu.Item>
            </Menu>
          </div>
          <Row type="flex" justify="space-between" align="middle">
            <Button
              disabled={!data}
              style={{ marginLeft: 20 }}
              onClick={async () => {
                const str = html2markdown(document.getElementById('content').innerHTML, {
                  converter: 'MarkdownExtra',
                });
                setMdStr(str);
                setModalVisible(true);
              }}
            >
              预览 markdown
            </Button>
          </Row>
        </Row>
      </Header>
      <Layout>
        <Sider width={350} style={{ background: '#fff', height: '100vh', overflow: 'scroll' }}>
          <ServiceMenu activeKey={activeKey} menus={menus} handleMenuClick={handleMenuClick} />
        </Sider>
        <Layout
          id="layoutWrapper"
          style={{ padding: '24px' }}
          onScroll={_.debounce(event => {
            if (!isMount) return;
            const item = Array.from(document.getElementsByTagName('h1')).find(
              inlineItem =>
                inlineItem.getBoundingClientRect().top > -50 &&
                inlineItem.getBoundingClientRect().bottom > 0,
            );
            if (!item) return;
            setActiveKeySource('scroll');
            setActiveKey(item.textContent);
          }, 100)}
        >
          <Content
            style={{
              background: '#fff',
              margin: 0,
              minHeight: 280,
            }}
          >
            <ServiceContent data={data}></ServiceContent>
          </Content>
          <BackTop
            target={() => document.getElementById('layoutWrapper')}
            style={{ right: '10px', bottom: '10px' }}
          />
          <Modal visible={modalVisible} footer={false} onCancel={() => setModalVisible(false)}>
            {<TextArea style={{ height: 400, marginTop: 20 }} value={mdStr}></TextArea>}
          </Modal>
        </Layout>
      </Layout>
    </Layout>
  );
});

export default ApiDocs;
