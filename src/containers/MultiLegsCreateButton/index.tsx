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
            !(
              item.type === LEG_TYPE_MAP.DOUBLE_SHARK_FIN_ANNUAL ||
              item.type === LEG_TYPE_MAP.DOUBLE_SHARK_FIN_UNANNUAL ||
              item.type === LEG_TYPE_MAP.TRIPLE_DIGITAL_ANNUAL ||
              item.type === LEG_TYPE_MAP.TRIPLE_DIGITAL_UNANNUAL ||
              item.type === LEG_TYPE_MAP.RANGE_ACCRUALS_ANNUAL ||
              item.type === LEG_TYPE_MAP.RANGE_ACCRUALS_UNANNUAL ||
              item.type === LEG_TYPE_MAP.STRADDLE_ANNUAL ||
              item.type === LEG_TYPE_MAP.STRADDLE_UNANNUAL ||
              item.type === LEG_TYPE_MAP.CONCAVA_ANNUAL ||
              item.type === LEG_TYPE_MAP.CONCAVA_UNANNUAL ||
              item.type === LEG_TYPE_MAP.CONVEX_ANNUAL ||
              item.type === LEG_TYPE_MAP.CONVEX_UNANNUAL ||
              item.type === LEG_TYPE_MAP.DOUBLE_DIGITAL_ANNUAL ||
              item.type === LEG_TYPE_MAP.DOUBLE_DIGITAL_UNANNUAL
            )
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
