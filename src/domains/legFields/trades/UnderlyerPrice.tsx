import { TRADESCOLDEFS_LEG_FIELD_MAP } from '@/constants/global';
import { TRADE_HEADER_CELL_STYLE } from '@/constants/legs';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { legEnvIsPricing, getRequiredRule } from '@/tools';
import { InputBase } from '@/components/type';
import { Tag, Icon } from 'antd';
import { RULES_REQUIRED, LEG_TYPE_FIELD, LEG_TYPE_MAP } from '@/constants/common';
import _ from 'lodash';

class UnderlyerPriceModalInput extends InputBase {
  public renderEditing() {
    const { value = [], onChange, onValueChange } = this.props;
    return (
      <>
        {_.values(value).map(item => (
          <Tag>{item}</Tag>
        ))}
      </>
    );
  }

  public renderRendering() {
    const { editing, value = [], onChange, onValueChange } = this.props;
    return (
      <>
        {_.values(value).map(item => (
          <Tag>{item}</Tag>
        ))}
      </>
    );
  }
}

export const UnderlyerPrice: ILegColDef = {
  editable: record => {
    return false;
  },
  title: '标的物价格',
  onHeaderCell: () => {
    return {
      style: TRADE_HEADER_CELL_STYLE,
    };
  },
  dataIndex: TRADESCOLDEFS_LEG_FIELD_MAP.UNDERLYER_PRICE,
  render: (value, record, index, { form, editing, colDef }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [getRequiredRule()],
        })(
          record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.SPREAD_EUROPEAN ||
            record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.RATIO_SPREAD_EUROPEAN ? (
            <UnderlyerPriceModalInput editing={editing} />
          ) : (
            <UnitInputNumber editing={false} autoSelect={true} />
          )
        )}
      </FormItem>
    );
  },
};
