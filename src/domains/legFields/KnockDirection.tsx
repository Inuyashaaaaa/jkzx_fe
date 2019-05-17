import {
  KNOCK_DIRECTION_OPTIONS,
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
} from '@/constants/common';
import { Form2, Select } from '@/design/components';
import { getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import { Icon, Tooltip } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
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
            title="行权价 < 障碍价为向上; 行权价 > 障碍价为向下"
            trigger="hover"
            placement="right"
            arrowPointAtCenter={true}
          >
            {form.getFieldDecorator({
              rules: [getRequiredRule()],
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
            rules: [getRequiredRule()],
          })(<Select defaultOpen={editing} editing={editing} options={KNOCK_DIRECTION_OPTIONS} />)
        )}
      </FormItem>
    );
  },
};
