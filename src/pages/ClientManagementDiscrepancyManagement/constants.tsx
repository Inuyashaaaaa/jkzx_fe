import {
  PROCESS_STATUS_TYPES_OPTIONS,
  PAYMENT_DIRECTION_TYPE_ZHCN_MAP,
  ACCOUNT_DIRECTION_TYPE_ZHCN_MAP,
  PROCESS_STATUS_TYPES_ZHCN_MAPS,
} from '@/constants/common';
import {
  refMasterAgreementSearch,
  refSimilarLegalNameList,
} from '@/services/reference-data-service';
import { ITableColDef, IFormColDef } from '@/components/type';
import { formatMoney } from '@/tools';
import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { Select, Input } from '@/containers';
import { DatePicker as AntdDatePicker } from 'antd';
const { RangePicker } = AntdDatePicker;

export const TABLE_COL_DEFS: ITableColDef[] = [
  {
    title: '交易对手',
    dataIndex: 'clientId',
  },
  {
    title: '主协议编号',
    dataIndex: 'masterAgreementId',
  },
  {
    title: '交易对手银行账号',
    dataIndex: 'bankAccount',
  },
  {
    title: '银行账户名',
    dataIndex: 'bankAccountName',
  },
  {
    title: '开户行',
    dataIndex: 'bankName',
  },
  // {
  //   title: '序列号',
  //   dataIndex: 'serialNumber',
  // },
  {
    title: '出入金额 (¥)',
    align: 'right',
    dataIndex: 'paymentAmount',
    render: (value, record, index) => formatMoney(value),
  },
  {
    title: '方向',
    dataIndex: 'paymentDirection',
    render: (value, record, index) => PAYMENT_DIRECTION_TYPE_ZHCN_MAP[value],
  },
  {
    title: '账户类型',
    dataIndex: 'accountDirection',
    render: (value, record, index) => ACCOUNT_DIRECTION_TYPE_ZHCN_MAP[value],
  },
  {
    title: '支付日期',
    dataIndex: 'paymentDate',
  },
  {
    title: '录入时间',
    dataIndex: 'createdAt',
  },
];

export const SEARCH_FORM_CONTROLS: IFormColDef[] = [
  {
    title: '交易对手',
    dataIndex: 'clientId',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(
            <Select
              style={{ minWidth: 180 }}
              showSearch={true}
              allowClear={true}
              fetchOptionsOnSearch={true}
              options={async (value: string = '') => {
                const { data, error } = await refSimilarLegalNameList({
                  similarLegalName: value,
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
    title: '主协议编号',
    dataIndex: 'masterAgreementId',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(
            <Select
              style={{ minWidth: 180 }}
              showSearch={true}
              allowClear={true}
              fetchOptionsOnSearch={true}
              options={async (value: string = '') => {
                const { data, error } = await refMasterAgreementSearch({
                  masterAgreementId: value,
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
    title: '银行账号',
    dataIndex: 'bankAccount',
    render: (value, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
    },
  },
  {
    title: '支付日期',
    dataIndex: 'paymentDate',
    render: (value, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<RangePicker />)}</FormItem>;
    },
  },
  {
    title: '出入金状态',
    dataIndex: 'processStatus',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(
            <Select
              style={{ minWidth: 180 }}
              allowClear={true}
              options={[{ label: '全部', value: 'all' }, ...PROCESS_STATUS_TYPES_OPTIONS]}
            />
          )}
        </FormItem>
      );
    },
  },
];
