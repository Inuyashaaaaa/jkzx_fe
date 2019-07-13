import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { IFormColDef } from '@/components/type';
import { Input, InputNumber, Select } from '@/containers';
import { IFormControl } from '@/containers/Form/types';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';

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
    editable: record => false,
    render: (value, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
            },
          ],
        })(<Input editing={false} />)}
      </FormItem>
    ),
  },
  {
    title: '维持保证金 (¥)',
    dataIndex: 'maintenanceMargin',
    editable: record => true,
    render: (value, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
            },
          ],
        })(<InputNumber editing={editing} min={0} precision={4} />)}
      </FormItem>
    ),
  },
];

export const IOGLOD_FORM_CONTROLS: IFormColDef[] = [
  {
    title: '客户名称',
    dataIndex: 'legalName',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
            },
          ],
        })(<Input disabled></Input>)}
      </FormItem>
    ),
  },
  {
    title: '资金类型',
    dataIndex: 'cashType',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '资产类型时必填项',
            },
          ],
        })(
          <Select
            options={[
              {
                label: '保证金冻结',
                value: '保证金冻结',
              },
              {
                label: '保证金释放',
                value: '保证金释放',
              },
            ]}
          ></Select>,
        )}
      </FormItem>
    ),
  },
  {
    title: '金额',
    dataIndex: 'cashFlow',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '金额必填',
            },
          ],
        })(<InputNumber precision={4}></InputNumber>)}
      </FormItem>
    ),
  },
];

export const UPDATE_FORM_CONTROLS: IFormColDef[] = [
  {
    title: '客户名称',
    dataIndex: 'legalName',
    render: (val, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<Input disabled></Input>)}</FormItem>
    ),
  },
  {
    title: '主协议编号',
    dataIndex: 'masterAgreementId',
    render: (val, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<Input disabled></Input>)}</FormItem>
    ),
  },
  {
    title: '当前维持保证金',
    dataIndex: 'originMaintenanceMargin',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(<InputNumber disabled precision={4}></InputNumber>)}
      </FormItem>
    ),
  },
  {
    title: '新维持保证金',
    dataIndex: 'maintenanceMargin',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '新维持保证金必填',
            },
          ],
        })(<InputNumber precision={4}></InputNumber>)}
      </FormItem>
    ),
  },
];
