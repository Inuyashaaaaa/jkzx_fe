import React, { memo } from 'react';
import { Icon } from 'antd';
import withRouter from 'umi/withRouter';
import Link from 'umi/link';
import ThemeMenu from '@/containers/ThemeMenu';
import styles from './Sider.less';
import UserLayout from './UserLayout';

const { SubMenu, Item } = ThemeMenu;

const Sider = props => (
  <div className={styles.wrap}>
    <ThemeMenu
      // onClick={handleClick}
      style={{ width: '100%', marginTop: 20 }}
      defaultSelectedKeys={[props.location.pathname]}
      mode="inline"
    >
      <ThemeMenu.Item key="/center/underlying">
        <Icon type="line-chart" />
        <Link to="/center/underlying">标的物分析</Link>
      </ThemeMenu.Item>
      <ThemeMenu.Item key="/center/risk">
        <Icon type="reconciliation" />
        <Link to="/center/risk">风险报告</Link>
      </ThemeMenu.Item>
      <ThemeMenu.Item key="/center/scenario">
        <Icon type="file-search" />
        <Link to="/center/scenario">情景分析</Link>
      </ThemeMenu.Item>
    </ThemeMenu>
    <UserLayout />
  </div>
);

export default memo(withRouter(Sider));
