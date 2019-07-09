import { Button, Dropdown, Menu, Icon } from 'antd';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { TOTAL_LEGS } from '@/constants/legs';
import { ILeg } from '@/types/leg';
import { getLegByType } from '@/tools';
import { LEG_TYPE_FIELD, LEG_TYPE_MAP, LEG_FIELD } from '@/constants/common';
import { Form2 } from '..';
import { validateExpirationDate } from '@/tools/leg';

export default class MultilLegCreateButton extends PureComponent<{
  handleAddLeg?: (leg: ILeg) => void;
  isPricing?: boolean;
  env?: string;
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

    // 移除暂不支持风险报告的交易结构
    const leftUsedLegs = _.reject(usedLegs, item => item.type === LEG_TYPE_MAP.CASH_FLOW);

    return leftUsedLegs;
  };

  public getLegMenuNodes = menus =>
    menus.map(item => {
      if (item.children) {
        return (
          <Menu.ItemGroup key={item.name} title={item.name}>
            {this.getLegMenuNodes(item.children)}
          </Menu.ItemGroup>
        );
      }
      return <Menu.Item key={item.type}>{item.name}</Menu.Item>;
    });

  public handleAddleg = leg => {
    if (leg.getDefaultData) {
      const result = leg.getDefaultData(this.props.env);
      validateExpirationDate(Form2.getFieldValue(result[LEG_FIELD.EXPIRATION_DATE]));
    }
    if (this.props.handleAddLeg) {
      this.props.handleAddLeg(leg);
    }
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
              this.handleAddleg(leg);
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
