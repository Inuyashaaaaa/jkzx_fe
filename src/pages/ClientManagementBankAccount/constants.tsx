import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { IFormControl } from '@/containers/Form/types';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { Select, Input } from '@/containers';
import { IFormColDef } from '@/components/type';

export const CREATE_FORM_CONTROLS: IFormColDef[] = [
  {
    title: '交易对手',
    dataIndex: 'legalName',
    render: (value, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '交易对手必填',
            },
          ],
        })(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear
            showSearch
            fetchOptionsOnSearch
            options={async (values: string = '') => {
              const { data, error } = await refSimilarLegalNameList({
                similarLegalName: values,
              });
              if (error) return [];
              return data.map(item => ({
                label: item,
                value: item,
              }));
            }}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '交易对手账号',
    dataIndex: 'bankAccount',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '交易对手账号必填',
            },
          ],
        })(<Input></Input>)}
      </FormItem>
    ),
  },
  {
    title: '交易对手账户名',
    dataIndex: 'bankAccountName',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '交易对手账户名必填',
            },
          ],
        })(<Input></Input>)}
      </FormItem>
    ),
  },
  {
    title: '交易对手开户行',
    dataIndex: 'bankName',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '交易对手开户行必填',
            },
          ],
        })(<Input></Input>)}
      </FormItem>
    ),
  },
  {
    title: '交易对手支付系统行号',
    dataIndex: 'paymentSystemCode',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '交易对手支付系统行号',
            },
          ],
        })(<Input></Input>)}
      </FormItem>
    ),
  },
];
