import { allLegTypes } from '@/constants/legColDefs';
import { Button, Dropdown, Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import React, { PureComponent } from 'react';

export default class MultilLegCreateButton extends PureComponent<{
  handleAddLeg?: (params: ClickParam) => void;
  isPricing?: boolean;
}> {
  public static defaultProps = {
    isPricing: false,
  };

  public normalLegMenus = () => {
    const usedLegs = allLegTypes;
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
          <Menu
            onClick={this.props.handleAddLeg}
            style={{ display: 'flex', justifyContent: 'start' }}
          >
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
