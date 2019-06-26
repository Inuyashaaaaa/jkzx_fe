import { INPUT_NUMBER_CURRENCY_CNY_CONFIG, INPUT_NUMBER_DIGITAL_CONFIG } from '@/constants/common';
import { IFormControl } from '@/containers/Form/types';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import React from 'react';
import { InputNumber, Input } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';

export const SEARCH_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '交易对手',
    },
    field: 'legalName',
    input: {
      type: 'select',
      showSearch: true,
      allowClear: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await refSimilarLegalNameList({
          similarLegalName: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
  {
    control: {
      label: '主协议编号',
    },
    field: 'masterAgreementId',
    input: {
      allowClear: true,
      type: 'select',
      showSearch: true,
      placeholder: '请输入内容搜索',
      options: async (value: string = '') => {
        const { data, error } = await refMasterAgreementSearch({
          masterAgreementId: value,
        });
        if (error) return [];
        return data.map(item => ({
          label: item,
          value: item,
        }));
      },
    },
  },
  // {
  //   control: {
  //     label: '状态',
  //   },
  //   input: {
  //     type: 'select',
  //     allowClear: true,
  //     options: MARGIN_STATUS_TYPE_OPTIONS,
  //   },
  //   field: 'status',
  // },
];

export const PAGE_TABLE_COL_DEFS = [
  {
    title: '客户名称',
    dataIndex: 'legalName',
    editable: record => {
      return false;
    },
    render: (value, record, index, { form, editing }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
              },
            ],
          })(<Input editing={false} />)}
        </FormItem>
      );
    },
  },
  {
    title: '维持保证金 (¥)',
    dataIndex: 'maintenanceMargin',
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
              },
            ],
          })(<InputNumber editing={editing} min={0} precision={4} />)}
        </FormItem>
      );
    },
  },
];

export const IOGLOD_FORM_CONTROLS: IFormControl[] = [
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '客户名称',
    },
    field: 'legalName',
    input: {
      disabled: true,
    },
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '资金类型',
    },
    input: {
      showSearch: true,
      type: 'select',
      options: [
        {
          label: '保证金冻结',
          value: '保证金冻结',
        },
        {
          label: '保证金释放',
          value: '保证金释放',
        },
      ],
    },
    field: 'cashType',
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '金额',
    },
    field: 'cashFlow',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
];

export const UPDATE_FORM_CONTROLS: IFormControl[] = [
  {
    control: {
      label: '客户名称',
    },
    field: 'legalName',
    input: {
      disabled: true,
    },
  },
  {
    control: {
      label: '主协议编号',
    },
    field: 'masterAgreementId',
    input: {
      disabled: true,
    },
  },
  {
    control: {
      label: '当前维持保证金',
    },
    field: 'originMaintenanceMargin',
    input: {
      disabled: true,
      ...INPUT_NUMBER_CURRENCY_CNY_CONFIG,
    },
  },
  {
    decorator: {
      rules: [
        {
          required: true,
        },
      ],
    },
    control: {
      label: '新维持保证金',
    },
    field: 'maintenanceMargin',
    input: INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  },
];
