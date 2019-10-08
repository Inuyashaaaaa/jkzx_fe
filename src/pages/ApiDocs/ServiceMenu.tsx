import { Menu } from 'antd';
import React, { memo, useState, useEffect } from 'react';
import _ from 'lodash';

const { SubMenu } = Menu;

const ServiceMenu = memo(props => {
  const { activeKey, menus, handleMenuClick } = props;
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const first = _.get(menus, '[0].name');
    if (!first) return;
    setOpenKeys([first]);
  }, [menus]);

  return (
    <Menu
      selectedKeys={[activeKey]}
      mode="inline"
      openKeys={openKeys}
      onOpenChange={event => {
        setOpenKeys([_.last(event)]);
      }}
      style={{ height: '100%', borderRight: 0 }}
    >
      {menus.map(item => (
        <SubMenu key={item.name} title={<span>{item.name}</span>}>
          {(item.children || []).map(inlineItem => (
            <Menu.Item onClick={handleMenuClick} key={inlineItem.method}>
              {inlineItem.method}
            </Menu.Item>
          ))}
        </SubMenu>
      ))}
    </Menu>
  );
});

export default ServiceMenu;
