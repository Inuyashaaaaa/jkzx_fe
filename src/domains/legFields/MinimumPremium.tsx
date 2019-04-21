import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  PREMIUM_TYPE_MAP,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
} from '@/constants/common';
import { LEG_ENV } from '@/constants/legs';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2 } from '@/design/components';
import { legEnvIsBooking } from '@/tools';
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
  if (_.get(record, [LEG_FIELD.PREMIUM_TYPE, 'value']) === PREMIUM_TYPE_MAP.CNY) {
    return { unit: '¥' };
  }
  return { unit: '%' };
};

export const MinimumPremium: ILegColDef = {
  editable: record => {
    if (legEnvIsBooking(record)) {
      return false;
    }
    return true;
  },
  title: '保底收益',
  dataIndex: LEG_FIELD.MINIMUM_PREMIUM,
  exsitable: record => {
    if (Form2.getFieldValue(record[LEG_FIELD.IS_ANNUAL])) {
      return true;
    }
    return false;
  },
  render: (val, record, index, { form, editing, colDef }) => {
    const isBooking = legEnvIsBooking(record);
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <UnitInputNumber
            autoSelect={!isBooking}
            editing={isBooking ? true : editing}
            {...getProps(record)}
          />
        )}
      </FormItem>
    );
  },
};
