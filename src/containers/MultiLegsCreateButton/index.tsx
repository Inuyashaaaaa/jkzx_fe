import { TOTAL_LEGS } from '@/constants/legs';
import { ILeg } from '@/types/leg';
import { Button, Dropdown, Menu, Icon } from 'antd';
import React, { PureComponent } from 'react';
import { getLegByType } from '@/tools';
import { LEG_TYPE_FIELD, LEG_TYPE_MAP } from '@/constants/common';
import _ from 'lodash';

export default class MultilLegCreateButton extends PureComponent<{
  handleAddLeg?: (leg: ILeg) => void;
  isPricing?: boolean;
}> {
  public static defaultProps = {
    isPricing: false,
  };

  public normalLegMenus = () => {
    const filterLegs = _.reject(TOTAL_LEGS, item => {
      if (!item) return true;
      return (
        item.type === LEG_TYPE_MAP.MODEL_XY ||
        item.type === LEG_TYPE_MAP.SPREAD_EUROPEAN ||
        item.type === LEG_TYPE_MAP.RATIO_SPREAD_EUROPEAN
      );
    });
    const usedLegs = this.props.isPricing ? filterLegs : TOTAL_LEGS;
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
            style={{
              height: '400px',
              width: '300px',
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
            }}
            onClick={event => {
              const leg = getLegByType(event.key);
              this.props.handleAddLeg(leg);
            }}
          >
            {this.getLegMenuNodes(this.normalLegMenus())}
          </Menu>
        }
        placement="bottomLeft"
      >
        <Button type="primary">
          添加期权结构
          <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}
