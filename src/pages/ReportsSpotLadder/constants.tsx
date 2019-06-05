import { Input, InputNumber, Select } from '@/containers';
import { IFormColDef, ITableColDef } from '@/components/type';
import RangeNumberInput from '@/containers/RangeNumberInput';
import { trdBookListBySimilarBookName } from '@/services/trade-service';
import { formatMoney, formatNumber } from '@/tools';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import styles from './index.less';

export const TABLE_COL_DEFS: ITableColDef[] = [
  {
    title: 'scenario',
    dataIndex: 'scenarioId',
  },
  {
    title: '标的物价格(￥)',
    align: 'right',
    dataIndex: 'underlyerPrice',
    onCell: () => ({ style: { justifyContent: 'flex-end' } }),
    render: (val, record, index) => formatMoney(val),
  },
  {
    title: '价格(￥)',
    align: 'right',
    dataIndex: 'price',
    onCell: () => ({ style: { justifyContent: 'flex-end' } }),
    render: (val, record, index) => formatMoney(val),
  },
  {
    title: 'PNL变动(￥)',
    align: 'right',
    dataIndex: 'pnlChange',
    onCell: () => ({ style: { justifyContent: 'flex-end' } }),
    render: (val, record, index) => formatMoney(val),
  },
  {
    title: 'DELTA(手)',
    align: 'right',
    dataIndex: 'delta',
    onCell: () => ({ style: { justifyContent: 'flex-end' } }),
    render: (val, record, index) => formatMoney(val),
  },
  {
    title: 'DELTA CASH(￥)',
    align: 'right',
    dataIndex: 'deltaCash',
    onCell: () => ({ style: { justifyContent: 'flex-end' } }),
    render: (val, record, index) => formatMoney(val),
  },
  {
    title: 'GAMMA',
    align: 'right',
    dataIndex: 'gamma',
    onCell: () => ({ style: { justifyContent: 'flex-end' } }),
    render: (val, record, index) => formatNumber(val, 4),
  },
  {
    title: 'GAMMA CASH(￥)',
    align: 'right',
    dataIndex: 'gammaCash',
    onCell: () => ({ style: { justifyContent: 'flex-end' } }),
    render: (val, record, index) => formatMoney(val),
  },
  {
    title: 'VEGA(￥)',
    align: 'right',
    dataIndex: 'vega',
    onCell: () => ({ style: { justifyContent: 'flex-end' } }),
    render: (val, record, index) => formatMoney(val),
  },
  {
    title: 'THETA(￥)',
    align: 'right',
    dataIndex: 'theta',
    onCell: () => ({ style: { justifyContent: 'flex-end' } }),
    render: (val, record, index) => formatMoney(val),
  },
  {
    title: 'RHO_R',
    align: 'right',
    dataIndex: 'rhoR',
    onCell: () => ({ style: { justifyContent: 'flex-end' } }),
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
