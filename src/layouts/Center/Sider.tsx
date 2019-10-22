import React, { memo, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import withRouter from 'umi/withRouter';
import Link from 'umi/link';
import ThemeMenu from '@/containers/ThemeMenu';
import styles from './Sider.less';
import User from './User';

const { SubMenu, Item } = ThemeMenu;

const Sider = props => {
  const { centerMenuData = [] } = props.menu;

  return (
    <div className={styles.wrap}>
      <ThemeMenu
        // onClick={handleClick}
        style={{ width: '100%', marginTop: 20 }}
        defaultSelectedKeys={[props.location.pathname]}
        mode="inline"
      >
        {centerMenuData
          .filter(item => item.name && !item.hideInMenu && !item.noPermission)
          .map(item => {
            if (item.children) {
              return (
                <SubMenu
                  key={item.path}
                  title={
                    <span>
                      <Icon type={item.icon} />
                      <span>{item.label}</span>
                    </span>
                  }
                >
                  {item.children
                    .filter(child => child.name && !child.hideInMenu && !child.noPermission)
                    .map(child => (
                      <Item key={child.path}>
                        <Link to={child.path}>{child.label}</Link>
                      </Item>
                    ))}
                </SubMenu>
              );
            }
            return (
              <Item key={item.path}>
                <Icon type={item.icon} />
                <Link to={item.path}>{item.label}</Link>
              </Item>
            );
          })}
        {/* <Item key="/center/underlying">
          <Icon type="line-chart" />
          <Link to="/center/underlying">场外期权估值</Link>
        </Item>
        <Item key="/center/risk">
          <Icon type="reconciliation" />
          <Link to="/center/risk">主体估值监测</Link>
        </Item>
        <Item key="/center/scenario">
          <Icon type="file-search" />
          <Link to="/center/scenario">情景分析测试</Link>
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
        </SubMenu> */}
      </ThemeMenu>
      <User />
    </div>
  );
};

// export default memo(withRouter(Sider));
// export default connect(({ global, setting, menu }) => ({
//   collapsed: global.collapsed,
//   layout: setting.layout,
//   menuData: menu.menuData,
//   ...setting,
// }))(Sider)
export default connect(({ menu }) => ({
  menu,
}))(withRouter(Sider));
