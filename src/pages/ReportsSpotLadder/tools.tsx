import { InputNumber, Select } from '@/containers';
import { IFormColDef } from '@/components/type';
import RangeNumberInput from '@/containers/RangeNumberInput';
import { trdBookListBySimilarBookName } from '@/services/trade-service';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';

export const SEARCH_FORM_CONTROLS: (underlyersOptions) => IFormColDef[] = underlyersOptions => [
  {
    dataIndex: 'bookId',
    title: '交易簿',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '交易簿必填',
              },
            ],
          })(
            <Select
              showSearch={true}
              allowClear={true}
              style={{ minWidth: 180 }}
              fetchOptionsOnSearch={true}
              options={async (value: string = '') => {
                const { data, error } = await trdBookListBySimilarBookName({
                  similarBookName: value,
                });
                if (error) return [];
                return _.union(data).map(item => ({
                  label: item,
                  value: item,
                }));
              }}
            />
          )}
        </FormItem>
      );
    },
  },
  {
    dataIndex: 'underlyers',
    title: '标的物',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(
            <Select
              style={{ minWidth: 180 }}
              showSearch={true}
              filterOption={true}
              mode={'multiple'}
              options={underlyersOptions}
            />
          )}
        </FormItem>
      );
    },
  },
  {
    dataIndex: 'priceRange',
    title: '价格范围(%)',
    render: (val, record, index, { form }) => {
      return <RangeNumberInput />;
    },
  },
  {
    dataIndex: 'num',
    title: '情景个数',
    render: (val, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<InputNumber min={0} />)}</FormItem>;
    },
  },
];
