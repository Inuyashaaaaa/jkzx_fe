import {
  INPUT_NUMBER_CURRENCY_CNY_CONFIG,
  INPUT_NUMBER_DIGITAL_CONFIG,
  MARGIN_STATUS_TYPE_OPTIONS,
} from '@/constants/common';
import { IFormControl } from '@/containers/Form/types';
import { IColumnDef } from '@/containers/Table/types';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import React from 'react';
import Operations from './Operations';
import { formatMoney } from '@/tools';
import { Select, InputNumber, Input } from '@/containers';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import { UnitInputNumber } from '@/containers/UnitInputNumber';

export const TABLE_COL_DEFS: (fetchTable) => IColumnDef[] = fetchTable => [
  {
    headerName: '交易对手',
    field: 'legalName',
  },
  {
    headerName: '可用资金 (¥)',
    field: 'cash',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '剩余授信额度 (¥)',
    field: 'credit',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '冻结保证金 (¥)',
    field: 'margin',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '维持保证金 (¥)',
    field: 'maintenanceMargin',
    input: INPUT_NUMBER_DIGITAL_CONFIG,
  },
  {
    headerName: '状态',
    field: 'status',
    input: {
      type: 'select',
      options: MARGIN_STATUS_TYPE_OPTIONS,
    },
  },
  {
    headerName: '操作',
    width: 300,
    render: params => {
      return <Operations record={params.data} fetchTable={fetchTable} />;
    },
  },
];

export const TABLE_COLUMNS = fetchTable => [
  {
    title: '交易对手',
    dataIndex: 'legalName',
  },
  {
    title: '可用资金 (¥)',
    align: 'right',
    dataIndex: 'cash',
    render: (text, record, index) => {
      return formatMoney(text, {});
    },
  },
  {
    title: '剩余授信额度 (¥)',
    dataIndex: 'credit',
    align: 'right',
    render: (text, record, index) => {
      return formatMoney(text, {});
    },
  },
  {
    title: '冻结保证金 (¥)',
    align: 'right',
    dataIndex: 'margin',
    render: (text, record, index) => {
      return formatMoney(text, {});
    },
  },
  {
    title: '维持保证金 (¥)',
    align: 'right',
    dataIndex: 'maintenanceMargin',
    render: (text, record, index) => {
      return formatMoney(text, {});
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (value, record, index) => {
      return MARGIN_STATUS_TYPE_OPTIONS[
        _.findIndex(MARGIN_STATUS_TYPE_OPTIONS, item => {
          return item.value === value;
        })
      ].label;
    },
  },
  {
    title: '操作',
    width: 250,
    fixed: 'right',
    render: (text, record, index) => {
      return <Operations record={text} fetchTable={fetchTable} />;
    },
  },
];

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

// export const PAGE_TABLE_COL_DEFS: IColumnDef[] = [
//   {
//     headerName: '客户名称',
//     field: 'legalName',
//   },
//   {
//     headerName: '维持保证金 (¥)',
//     field: 'maintenanceMargin',
//     editable: true,
//     input: INPUT_NUMBER_DIGITAL_CONFIG,
//   },
// ];

export const PAGE_TABLE_COL_DEFS: IColumnDef[] = [
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
