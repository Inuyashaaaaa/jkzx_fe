import { TOTAL_LEGS } from '@/constants/legs';
import { ILeg } from '@/types/leg';
import { Button, Dropdown, Menu } from 'antd';
import React, { PureComponent } from 'react';

export default class MultilLegCreateButton extends PureComponent<{
  handleAddLeg?: (leg: ILeg) => void;
  isPricing?: boolean;
}> {
  public static defaultProps = {
    isPricing: false,
  };

  public normalLegMenus = () => {
    const usedLegs = TOTAL_LEGS;
    return usedLegs;
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
        overlay={
          <Menu
            onClick={event => {
              const leg = TOTAL_LEGS.find(item => item.type === event.key);
              this.props.handleAddLeg(leg);
            }}
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
