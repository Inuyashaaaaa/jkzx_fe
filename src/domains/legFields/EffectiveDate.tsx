import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { DatePicker, Select } from '@/design/components';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const EffectiveDate: ILegColDef = {
  title: '起始日',
  editable: true,
  dataIndex: LEG_FIELD.EFFECTIVE_DATE,
  render: (value, record, index, { form, editing }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          <DatePicker
            {...{
              editing,
              defaultOpen: true,
              format: 'YYYY-MM-DD',
            }}
          />
        )}
      </FormItem>
    );
  },
};
