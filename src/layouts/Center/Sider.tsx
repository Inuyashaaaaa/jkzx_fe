import React, { memo } from 'react';
import { Icon } from 'antd';
import withRouter from 'umi/withRouter';
import Link from 'umi/link';
import ThemeMenu from '@/containers/ThemeMenu';
import styles from './Sider.less';
import User from './User';

const { SubMenu, Item } = ThemeMenu;

const Sider = props => (
  <div className={styles.wrap}>
    <ThemeMenu
      // onClick={handleClick}
      style={{ width: '100%', marginTop: 20 }}
      defaultSelectedKeys={[props.location.pathname]}
      mode="inline"
    >
      <Item key="/center/underlying">
        <Icon type="line-chart" />
        <Link to="/center/underlying">标的物分析</Link>
      </Item>
      <Item key="/center/risk">
        <Icon type="reconciliation" />
        <Link to="/center/risk">风险报告</Link>
      </Item>
      <Item key="/center/scenario">
        <Icon type="file-search" />
        <Link to="/center/scenario">情景分析</Link>
      </Item>
      <SubMenu
        key="/center/market"
        title={
          <span>
            <Icon type="pie-chart" />
            <span>市场统计监测</span>
          </span>
        }
      >
        <Item key="/center/operation-quality">
          <Link to="/center/operation-quality">市场运行质量</Link>
        </Item>
        <Item key="/center/risk-monitoring">
          <Link to="/center/risk-monitoring">风险监测</Link>
        </Item>
      </SubMenu>
    </ThemeMenu>
    <User />
  </div>
);

export default memo(withRouter(Sider));
