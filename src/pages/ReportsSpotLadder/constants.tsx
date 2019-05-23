import { ITableColDef, IFormColDef } from '@/components/type';
import { formatMoney, formatNumber } from '@/tools';
import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { Input, InputNumber, Select } from '@/components';
import { trdBookListBySimilarBookName, trdInstrumentListByBook } from '@/services/trade-service';
import _ from 'lodash';
import RangeNumberInput from '@/containers/RangeNumberInput';

export const TABLE_COL_DEFS: ITableColDef[] = [
  {
    title: 'scenario',
    dataIndex: 'scenarioId',
  },
  {
    title: '标的物价格',
    dataIndex: 'underlyerPrice',
    render: (val, record, index) => formatMoney(val, { unit: '￥' }),
  },
  {
    title: '价格',
    dataIndex: 'price',
    render: (val, record, index) => formatMoney(val, { unit: '￥' }),
  },
  {
    title: 'PNL变动',
    dataIndex: 'pnlChange',
    render: (val, record, index) => formatMoney(val, { unit: '￥' }),
  },
  {
    title: 'DELTA',
    dataIndex: 'delta',
    render: (val, record, index) => formatNumber(val, 4) + ' 手',
  },
  {
    title: 'DELTA CASH',
    dataIndex: 'deltaCash',
    render: (val, record, index) => formatMoney(val, { unit: '￥' }),
  },
  {
    title: 'GAMMA',
    dataIndex: 'gamma',
    render: (val, record, index) => formatNumber(val, 4),
  },
  {
    title: 'GAMMA CASH',
    dataIndex: 'gammaCash',
    render: (val, record, index) => formatMoney(val, { unit: '￥' }),
  },
  {
    title: 'VEGA',
    dataIndex: 'vega',
    render: (val, record, index) => formatMoney(val, { unit: '￥' }),
  },
  {
    title: 'THETA',
    dataIndex: 'theta',
    render: (val, record, index) => formatMoney(val, { unit: '￥' }),
  },
  {
    title: 'RHO_R',
    dataIndex: 'rhoR',
    render: (val, record, index) => formatNumber(val, 4),
  },
];

export const TABLE_FORM_CONTROLS: IFormColDef[] = [
  {
    title: '标的物名称',
    dataIndex: 'underlyerInstrumentId',
    render: (value, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<Input editing={false} />)}</FormItem>;
    },
  },
  {
    title: '资产类别',
    dataIndex: 'assetClass',
    render: (value, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<Input editing={false} />)}</FormItem>;
    },
  },
  {
    title: '合约类型',
    dataIndex: 'instrumentType',
    render: (value, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<Input editing={false} />)}</FormItem>;
    },
  },
];

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
