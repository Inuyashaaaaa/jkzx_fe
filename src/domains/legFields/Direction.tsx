import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Select } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const Direction: ILegColDef = {
  editable: true,
  title: '买卖方向',
  dataIndex: LEG_FIELD.DIRECTION,
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <Select
            {...{
              editing,
              defaultOpen: true,
              options: [
                {
                  label: '买',
                  value: 'BUYER',
                },
                {
                  label: '卖',
                  value: 'SELLER',
                },
              ],
            }}
          />
        )}
      </FormItem>
    );
  },
};
