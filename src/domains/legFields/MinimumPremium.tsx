import { LEG_FIELD, PREMIUM_TYPE_MAP, RULES_REQUIRED, STRIKE_TYPES_MAP } from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

/**
 * if (默认) {}
 * if (环境默认) {}
 * if (腿类型默认) {}
 * if (腿 + 环境 默认) {}
 * if (腿 + 环境) return;
 * if (腿) return;
 */
const getProps = record => {
  let props;

  if (_.get(record, [LEG_FIELD.PREMIUM_TYPE, 'value']) === PREMIUM_TYPE_MAP.CNY) {
    props = { unit: '¥' };
  }
  props = { unit: '%' };

  return props;
};

export const MinimumPremium: ILegColDef = {
  editable: true,
  title: '保底收益',
  dataIndex: LEG_FIELD.MINIMUM_PREMIUM,
  exsitable: record => {
    if (_.get(record, [LEG_FIELD.IS_ANNUAL, 'value'])) {
      return true;
    }
    return false;
  },
  render: (val, record, index, { form, editing }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(<UnitInputNumber autoSelect={true} editing={editing} {...getProps(record)} />)}
      </FormItem>
    );
  },
};
