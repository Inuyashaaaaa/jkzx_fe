import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  EQUITY_EXCHANGE_ZHCN_MAP,
  COMMODITY_EXCHANGE_ZHCN_MAP,
  ASSET_CLASS_ZHCN_MAP,
  INSTRUMENT_TYPE_ZHCN_MAP,
} from '@/constants/common';
import { IFormControl } from '@/containers/_Form2';
import { IColumnDef } from '@/containers/_Table2';
import { mktInstrumentSearch } from '@/services/market-data-service';
import { getDate, getUnit } from '@/tools/format';
import { formatNumber } from '@/tools';
import { IFormColDef } from '@/components/type';
import FormItem from 'antd/lib/form/FormItem';
import { Select, DatePicker, InputNumber } from '@/containers';
import React from 'react';

export const columns = [
  {
    title: '标的物代码',
    dataIndex: 'instrumentId',
    fixed: 'left',
    width: 150,
  },
  {
    title: '标的物名称',
    dataIndex: 'instrumentName',
    width: 150,
  },
  {
    title: '买价 (¥)',
    dataIndex: 'bid',
    render: (value, record, index) => formatNumber(value, 4),
    width: 150,
  },
  {
    title: '卖价 (¥)',
    dataIndex: 'ask',
    render: (value, record, index) => formatNumber(value, 4),
    width: 150,
  },
  {
    title: '最新成交价 (¥)',
    dataIndex: 'last',
    render: (value, record, index) => formatNumber(value, 4),
    width: 150,
  },
  {
    title: '时间戳',
    dataIndex: 'intradayQuoteTimestamp',
    render: (value, record, index) => {
      return getDate(value);
    },
    width: 200,
  },
  {
    title: '今收 (¥)',
    dataIndex: 'close',
    render: (value, record, index) => formatNumber(value, 4),
    width: 150,
  },
  // {
  //   title: '昨收 (¥)',
  //   dataIndex: 'close',
  //   render: (value, record, index) => formatNumber(value, 4),
  //   width: 150,
  // },
  {
    title: '交易所',
    dataIndex: 'exchange',
    render: (value, record, index) => {
      return {
        ...EQUITY_EXCHANGE_ZHCN_MAP,
        ...COMMODITY_EXCHANGE_ZHCN_MAP,
      }[value];
    },
    width: 150,
  },
  {
    title: '合约乘数',
    dataIndex: 'multiplier',
    render: (value, record, index) => formatNumber(value, 4),
    width: 150,
  },
  {
    title: '合约类型',
    dataIndex: 'instrumentType',
    render: (value, record, index) => INSTRUMENT_TYPE_ZHCN_MAP[value],
    width: 150,
  },
  {
    title: '合约到期日',
    dataIndex: 'maturity',
  },
];

export const INTRADAY_FORM_CONTROLS: IFormColDef[] = [
  {
    title: '标的物',
    dataIndex: 'instrumentId',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '标的物必填',
              },
            ],
          })(
            <Select
              style={{ minWidth: 180 }}
              placeholder="请输入内容搜索"
              allowClear={true}
              showSearch={true}
              fetchOptionsOnSearch={true}
              options={async (value: string = '') => {
                const { data, error } = await mktInstrumentSearch({
                  instrumentIdPart: value,
                });
                if (error) return [];
                return data.map(item => ({
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
    title: '行情日期',
    dataIndex: 'valuationDate',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '行情日期必填',
              },
            ],
          })(<DatePicker format="YYYY-MM-DD" />)}
        </FormItem>
      );
    },
  },
  {
    title: '买入价',
    dataIndex: 'ask',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '买入价必填',
              },
            ],
          })(<InputNumber min={0} />)}
        </FormItem>
      );
    },
  },
  {
    title: '卖出价',
    dataIndex: 'bid',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '卖出价必填',
              },
            ],
          })(<InputNumber min={0} />)}
        </FormItem>
      );
    },
  },
  {
    title: '最新成交价',
    dataIndex: 'last',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '最新成交价必填',
              },
            ],
          })(<InputNumber min={0} />)}
        </FormItem>
      );
    },
  },
];

export const CLOSE_FORM_CONTROLS: IFormColDef[] = [
  {
    title: '标的物',
    dataIndex: 'instrumentId',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '标的物必填',
              },
            ],
          })(
            <Select
              style={{ minWidth: 180 }}
              placeholder="请输入内容搜索"
              allowClear={true}
              showSearch={true}
              fetchOptionsOnSearch={true}
              options={async (value: string = '') => {
                const { data, error } = await mktInstrumentSearch({
                  instrumentIdPart: value,
                });
                if (error) return [];
                return data.map(item => ({
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
    title: '行情日期',
    dataIndex: 'valuationDate',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '行情日期必填',
              },
            ],
          })(<DatePicker format="YYYY-MM-DD" />)}
        </FormItem>
      );
    },
  },
  {
    title: '结算价',
    dataIndex: 'settle',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '结算价必填',
              },
            ],
          })(<InputNumber min={0} />)}
        </FormItem>
      );
    },
  },
  {
    title: '收盘价',
    dataIndex: 'close',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '收盘价必填',
              },
            ],
          })(<InputNumber min={0} />)}
        </FormItem>
      );
    },
  },
];
