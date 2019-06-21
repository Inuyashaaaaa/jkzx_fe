import React from 'react';
import { IFormControl } from '@/containers/_Form2';
import { IColumnDef } from '@/containers/Table/types';
import { mktInstrumentWhitelistSearch } from '@/services/market-data-service';
import { Input } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';
import { UnitInputNumber } from '@/containers/UnitInputNumber';

export const SEARCH_FORM_CONTROLS: IFormControl[] = [
  {
    dataIndex: 'instrumentIds',
    control: {
      label: '标的物列表',
    },
    input: {
      type: 'select',
      mode: 'multiple',
      options: async (value: string) => {
        const { data, error } = await mktInstrumentWhitelistSearch({
          instrumentIdPart: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
];

export const PAGE_TABLE_COL_DEFS: IColumnDef[] = [
  {
    title: '交易所',
    dataIndex: 'venueCode',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '不能为空',
              },
            ],
          })(<Input editing={false} />)}
        </FormItem>
      );
    },
  },
  {
    title: '标的',
    dataIndex: 'instrumentId',
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '不能为空',
              },
            ],
          })(<Input editing={false} />)}
        </FormItem>
      );
    },
  },
  {
    title: '存续期名义金额上限',
    dataIndex: 'notionalLimit',
    editable: record => {
      return true;
    },
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '不能为空',
              },
            ],
          })(<UnitInputNumber unit="￥" editing={editing} />)}
        </FormItem>
      );
    },
    // input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
    // rules: [
    //   {
    //     required: true,
    //     message: '不能为空',
    //   },
    // ],
  },
];
