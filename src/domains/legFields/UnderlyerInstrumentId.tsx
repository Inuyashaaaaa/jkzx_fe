import { LEG_FIELD, RULES_REQUIRED } from '@/constants/common';
import { Input, Select } from '@/design/components';
import { mktInstrumentSearch } from '@/services/market-data-service';
import { ILegColDef } from '@/types/leg';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';

export const UnderlyerInstrumentId: ILegColDef = {
  title: '标的物',
  dataIndex: LEG_FIELD.UNDERLYER_INSTRUMENT_ID,
  editable: true,
  render: (val, record, index, { form, editing }) => {
    return (
      <FormItem hasFeedback={true}>
        {form.getFieldDecorator({
          rules: RULES_REQUIRED,
        })(
          editing ? (
            <Select
              {...{
                editing,
                fetchOptionsOnSearch: true,
                placeholder: '请输入内容搜索',
                defaultOpen: true,
                autoFocus: true,
                showSearch: true,
                options: async (value: string) => {
                  const { data, error } = await mktInstrumentSearch({
                    instrumentIdPart: value,
                  });
                  if (error) return [];
                  return data.slice(0, 50).map(item => ({
                    label: item,
                    value: item,
                  }));
                },
              }}
            />
          ) : (
            <Input editing={editing} />
          )
        )}
      </FormItem>
    );
  },
};
