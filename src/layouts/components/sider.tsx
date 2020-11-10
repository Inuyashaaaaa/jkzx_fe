import { ThemeMenu } from '@/components';
import { ModelNameSpaces, RootStore } from '@/types';
import React, { memo } from 'react';
import { Link, useIntl } from 'umi';
import { useDispatch, useSelector } from 'dva';
import styles from './sider.less';
import User from './user';
import utl from 'lodash';

const { SubMenu, Item } = ThemeMenu;

const Sider = memo((props) => {
  const intl = useIntl();

  const dispatch = useDispatch();
  const { menus } = useSelector((state: RootStore) => {
    console.log('123123123', state);
    return state[ModelNameSpaces.User];
  });

  const routesByHideInMenu = ['/', '/center/welcome-page', '/404', '/center'];

  const normalizeIdWithPath = (path: string) => {
    const items = path.split('/');
    const id = items.slice(1).join('.');
    return `menu.${id}`;
  };

  const renderMenus = (menusData?: RootStore[ModelNameSpaces.User]['menus']) => {
    return (menusData || [])
      .filter((item) => routesByHideInMenu.includes(item.path) === false)
      .map((item) => {
        if (item.routes) {
          return (
            <SubMenu
              key={item.path}
              title={
                <span>
                  {/* <Icon type={item.icon} /> */}
                  <span>
                    {intl.formatMessage({
                      id: normalizeIdWithPath(item.path),
                      defaultMessage: item.path,
                    })}
                  </span>
                </span>
              }
            >
              {/** @todo remove as */}
              {renderMenus(item.routes)}
            </SubMenu>
          );
        }
        return (
          <Item key={item.path}>
            {/* <Icon type={item.icon} /> */}
            <Link to={item.path}>
              {intl.formatMessage({
                id: normalizeIdWithPath(item.path),
                defaultMessage: item.path,
              })}
            </Link>
          </Item>
        );
      });
  };

  return (
    <div className={styles.wrap}>
      <ThemeMenu
        // onClick={handleClick}
        style={{ width: '100%', marginTop: 20 }}
        // defaultSelectedKeys={[props.location.pathname]}
        mode="inline"
      >
        {renderMenus(menus[0].routes)}
      </ThemeMenu>
      <User />
    </div>
  );
});

export default Sider;
