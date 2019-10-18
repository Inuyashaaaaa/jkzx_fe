import styled from 'styled-components';
import React, { memo } from 'react';
import classnames from 'classnames';
import { Menu } from 'antd';
// import styles from './ThemeMenu.less';

const { SubMenu, Item, ItemGroup } = Menu;

const ThemeMenuWrap = styled.div`
  .ant-menu {
    color: rgba(246, 250, 255, 0.5);
  }
  .ant-menu-item > a {
    display: inline;
    color: rgba(246, 250, 255, 0.5);
  }
  .ant-menu,
  .ant-menu-submenu > .ant-menu {
    background-color: transparent;
  }
  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: none;
  }
  .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: rgba(35, 77, 125, 1);
  }
  .ant-menu-vertical .ant-menu-item::after,
  .ant-menu-vertical-left .ant-menu-item::after,
  .ant-menu-vertical-right .ant-menu-item::after,
  .ant-menu-inline .ant-menu-item::after {
    border-right: 2px solid rgba(0, 232, 232, 1);
    left: 0;
    right: inherit;
  }
  .ant-menu-item:hover,
  .ant-menu-item:hover > a,
  .ant-menu-item:hover > a:hover,
  .ant-menu-item-selected,
  .ant-menu-item-selected > a,
  .ant-menu-item-selected > a:hover .ant-menu-item:hover,
  .ant-menu-item-active,
  .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-submenu-active,
  .ant-menu-submenu-title:hover,
  .ant-menu-submenu-selected {
    color: rgba(246, 250, 255, 1);
  }
  .ant-menu-inline .ant-menu-item,
  .ant-menu-inline .ant-menu-submenu-title {
    width: 100%;
    font-size: 18px;
  }
  .ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-vertical-left > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-vertical-right > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before,
  .ant-menu-submenu-vertical-left > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before,
  .ant-menu-submenu-vertical-right > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before,
  .ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before {
    background: rgba(246, 250, 255, 1);
  }
`;

const ThemeMenu = memo(props => (
  <ThemeMenuWrap>
    <Menu {...props}></Menu>
  </ThemeMenuWrap>
));

ThemeMenu.SubMenu = SubMenu;
ThemeMenu.Item = Item;
ThemeMenu.ItemGroup = ItemGroup;

export default ThemeMenu;
