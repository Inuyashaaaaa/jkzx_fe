import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  OPTION_TYPE_OPTIONS,
  RULES_REQUIRED,
} from '@/constants/common';
import { Select } from '@/design/components';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { Icon, Tooltip } from 'antd';

const getProps = record => {};

export const OptionType: ILegColDef = {
  title: '类型',
  dataIndex: LEG_FIELD.OPTION_TYPE,
  editable: record => {
    const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    if (record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER) {
      return false;
    }
    if (isEditing) {
      return false;
    }
    return true;
  },
  defaultEditing: () => false,
  render: (val, record, index, { form, editing, colDef }) => {
    // const { isBooking, isPricing, isEditing } = getLegEnvs(record);
    const showTip = record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER && !editing;

    return (
      <FormItem>
        {showTip ? (
          <Tooltip
            title="行权价 < 障碍价时为看涨；行权价 > 障碍价时为看跌"
            trigger="hover"
            placement="right"
            arrowPointAtCenter={true}
          >
            {form.getFieldDecorator({
              rules: [getRequiredRule()],
            })(
              <Select
                defaultOpen={editing}
                editing={editing}
                options={OPTION_TYPE_OPTIONS}
                {...getProps(record)}
              />
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
          })(
            <Select
              defaultOpen={editing}
              editing={editing}
              options={OPTION_TYPE_OPTIONS}
              {...getProps(record)}
            />
          )
        )}
      </FormItem>
    );
  },
};
