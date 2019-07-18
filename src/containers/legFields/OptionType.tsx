import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { Icon, Tooltip } from 'antd';
import { ValidationRule } from 'antd/lib/form';
import {
  LEG_FIELD,
  LEG_TYPE_FIELD,
  LEG_TYPE_MAP,
  OPTION_TYPE_OPTIONS,
  RULES_REQUIRED,
  OPTION_TYPE_MAP,
} from '@/constants/common';
import { Select, Form2 } from '@/containers';
import { legEnvIsBooking, legEnvIsPricing, getLegEnvs, getRequiredRule } from '@/tools';
import { ILegColDef } from '@/types/leg';

const getProps = record => {};

export const OptionType: ILegColDef = {
  title: '类型',
  dataIndex: LEG_FIELD.OPTION_TYPE,
  onCellEditingChanged: params => {
    const { api, rowId, record, dataIndex } = params;

    if (dataIndex !== LEG_FIELD.OPTION_TYPE) return;
    const { tableApi, tableManager, eventBus } = api;
    const payment1Val = Form2.getFieldValue(record[LEG_FIELD.PAYMENT1]);
    const payment2Val = Form2.getFieldValue(record[LEG_FIELD.PAYMENT2]);
    const payment3Val = Form2.getFieldValue(record[LEG_FIELD.PAYMENT3]);
    const colIds = [
      payment1Val != null && LEG_FIELD.PAYMENT1,
      payment2Val != null && LEG_FIELD.PAYMENT2,
      payment3Val != null && LEG_FIELD.PAYMENT3,
    ].filter(item => !!item);
    if (colIds.length > 0) {
      tableApi.validate({ force: true }, [rowId], colIds);
    }
  },
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
    const showTip = record[LEG_TYPE_FIELD] === LEG_TYPE_MAP.BARRIER && !editing;
    return (
      <FormItem>
        {showTip ? (
          <Tooltip
            title="行权价 < 障碍价时为看涨；行权价 > 障碍价时为看跌"
            trigger="hover"
            placement="right"
            arrowPointAtCenter
          >
            {form.getFieldDecorator({
              rules: [getRequiredRule()],
            })(
              <Select
                defaultOpen={editing}
                editing={editing}
                options={OPTION_TYPE_OPTIONS}
                {...getProps(record)}
              />,
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
            />,
          )
        )}
      </FormItem>
    );
  },
};
