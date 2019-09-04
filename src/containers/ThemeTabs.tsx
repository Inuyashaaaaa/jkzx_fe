import styled from 'styled-components';
import React, { memo } from 'react';
import { Tabs } from 'antd';
// import styles from './ThemeTabs.less';

const { TabPane } = Tabs;
const ThemeTabsWrap = styled.div`
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar {
    border: none;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    width: 150px;
    height: 32px;
    line-height: 32px;
    color: rgba(246, 250, 255, 1);
    background: rgba(4, 83, 126, 1);
    border-color: rgba(4, 83, 126, 1);
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    background: rgba(4, 119, 152, 1);
    border: 1px solid rgba(0, 232, 232, 1);
    text-align: center;
  }
`;

const ThemeTabs = memo(props => (
  <ThemeTabsWrap style={props.wrapStyle}>
    <Tabs {...props}></Tabs>
  </ThemeTabsWrap>
));
ThemeTabs.TabPane = TabPane;

export default ThemeTabs;
