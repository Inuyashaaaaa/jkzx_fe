import React, { memo, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import withRouter from 'umi/withRouter';
import Link from 'umi/link';
import ThemeMenu from '@/containers/ThemeMenu';
import styles from './sider.less';
import User from './user';

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
      </ThemeMenu>
      <User />
    </div>
  );
};

export default connect(({ menu }) => ({
  menu,
}))(withRouter(Sider));
