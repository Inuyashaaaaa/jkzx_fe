import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  PREMIUM_TYPE_MAP,
  RULES_REQUIRED,
  STRIKE_TYPES_MAP,
  REBATETYPE_TYPE_OPTIONS,
  KNOCK_DIRECTION_OPTIONS,
} from '@/constants/common';
import { UnitInputNumber } from '@/containers/UnitInputNumber';
import { Form2, Select } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import { Tooltip, Icon } from 'antd';
import React from 'react';

export const KnockDirection: ILegColDef = {
  title: '敲出方向',
  dataIndex: LEG_FIELD.KNOCK_DIRECTION,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (isEditing) {
      return false;
    }
    if (Form2.getFieldValue(record[LEG_TYPE_FIELD]) === LEG_TYPE_MAP.BARRIER) {
      return false;
    }
    return true;
  },
  defaultEditing: record => {
    return false;
  },
  render: (val, record, index, { form, editing, colDef }) => {
    const showTip = record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER && !editing;

    return (
      <FormItem>
        {showTip ? (
          <Tooltip
            title="行权价>障碍价为向下;行权价>障碍价为向上"
            trigger="hover"
            placement="right"
            arrowPointAtCenter={true}
          >
            {form.getFieldDecorator({
              rules: RULES_REQUIRED,
            })(
              <Select defaultOpen={editing} editing={editing} options={KNOCK_DIRECTION_OPTIONS} />
            )}
            <Icon
              type="alert"
              theme="twoTone"
              style={{
                position: 'absolute',
                right: 0,
                transform: 'translateY(-50%)',
                top: '50%',
              }}
            />
          </Tooltip>
        ) : (
          form.getFieldDecorator({
            rules: RULES_REQUIRED,
          })(<Select defaultOpen={editing} editing={editing} options={KNOCK_DIRECTION_OPTIONS} />)
        )}
      </FormItem>
    );
  },
};
