import { LEG_TYPE_MAP } from '@/constants/common';
import { allLegTypes } from '@/constants/legColDefs';
import { AssetClassOptions } from '@/constants/legColDefs/common/common';
import { Button, Dropdown, Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import _ from 'lodash';
import React, { PureComponent } from 'react';

export default class MultilLegCreateButton extends PureComponent<{
  handleAddLeg?: (params: ClickParam) => void;
  isPricing?: boolean;
}> {
  public static defaultProps = {
    isPricing: false,
  };

  public normalLegMenus = () => {
    const usedLegs = this.props.isPricing
      ? allLegTypes.filter(
          item =>
            item.type === LEG_TYPE_MAP.VANILLA_AMERICAN_ANNUAL ||
            item.type === LEG_TYPE_MAP.VANILLA_AMERICAN_UNANNUAL ||
            item.type === LEG_TYPE_MAP.VANILLA_EUROPEAN_ANNUAL ||
            item.type === LEG_TYPE_MAP.VANILLA_EUROPEAN_UNANNUAL ||
            item.type === LEG_TYPE_MAP.DIGITAL_AMERICAN_ANNUAL ||
            item.type === LEG_TYPE_MAP.DIGITAL_AMERICAN_UNANNUAL ||
            item.type === LEG_TYPE_MAP.DIGITAL_EUROPEAN_ANNUAL ||
            item.type === LEG_TYPE_MAP.DIGITAL_EUROPEAN_UNANNUAL ||
            item.type === LEG_TYPE_MAP.VERTICAL_SPREAD_EUROPEAN_UNANNUAL ||
            item.type === LEG_TYPE_MAP.VERTICAL_SPREAD_EUROPEAN_ANNUAL ||
            item.type === LEG_TYPE_MAP.BARRIER_ANNUAL ||
            item.type === LEG_TYPE_MAP.BARRIER_UNANNUAL ||
            item.type === LEG_TYPE_MAP.EAGLE_ANNUAL ||
            item.type === LEG_TYPE_MAP.EAGLE_UNANNUAL ||
            item.type === LEG_TYPE_MAP.DOUBLE_TOUCH_ANNUAL ||
            item.type === LEG_TYPE_MAP.DOUBLE_TOUCH_UNANNUAL ||
            item.type === LEG_TYPE_MAP.DOUBLE_NO_TOUCH_ANNUAL ||
            item.type === LEG_TYPE_MAP.DOUBLE_NO_TOUCH_UNANNUAL
        )
      : allLegTypes;
    return [
      {
        name: '年化',
        children: usedLegs
          .filter(leg => leg.isAnnualized)
          .map(item => ({ ...item, name: item.name.replace(' - 年化', '') })),
      },
      {
        name: '非年化',
        children: usedLegs
          .filter(leg => !leg.isAnnualized)
          .map(item => ({ ...item, name: item.name.replace(' - 非年化', '') })),
      },
    ];
  };

  public getLegMenuNodes = menus => {
    return menus.map(item => {
      if (item.children) {
        return (
          <Menu.ItemGroup key={item.name} title={item.name}>
            {this.getLegMenuNodes(item.children)}
          </Menu.ItemGroup>
        );
      }
      return <Menu.Item key={item.type}>{item.name}</Menu.Item>;
    });
  };

  public render() {
    return (
      <Dropdown
        trigger={['click']}
        // disabled={this.state.dataSource.length >= 1}
        key="add"
        overlay={
          <Menu onClick={this.props.handleAddLeg}>
            {this.getLegMenuNodes(this.normalLegMenus())}
          </Menu>
        }
        placement="bottomLeft"
      >
        <Button type="primary">添加期权结构</Button>
      </Dropdown>
    );
  }
}
