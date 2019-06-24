import { ACCOUNT_DIRECTION_TYPE_OPTIONS, PAYMENT_DIRECTION_TYPE_OPTIONS } from '@/constants/common';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { IFormColDef } from '@/components/type';
import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { Select, InputNumber, DatePicker } from '@/containers';
import { Row, Col } from 'antd';
import styles from './index.less';

const { Option } = Select;

export const CREATE_FORM_CONTROLS: (bankAccountList) => IFormColDef[] = bankAccountList => [
  {
    title: '交易对手',
    dataIndex: 'clientId',
    render: (value, record, index, { form }) => {
      return (
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
    title: '交易对手银行账号',
    dataIndex: 'bankAccount',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '交易对手银行账号必填',
              },
            ],
          })(
            <Select allowClear={true} className={styles.bankAccount}>
              {bankAccountList.map(item => {
                return (
                  <Option value={item.value} title={item.label} key={item.value}>
                    <Row>{item.label}</Row>
                    <Row
                      style={{
                        color: 'rgba(0, 0, 0, 0.35)',
                      }}
                    >
                      <Col>账户名: {item.bankName ? item.bankName : '-'}</Col>
                      <Col>开户行: {item.bankAccountName ? item.bankAccountName : '-'}</Col>
                    </Row>
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      );
    },
  },
  {
    title: '出入金金额',
    dataIndex: 'paymentAmount',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '出入金金额必填',
              },
            ],
          })(<InputNumber />)}
        </FormItem>
      );
    },
  },
  {
    title: '出入金日期',
    dataIndex: 'paymentDate',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '出入金日期必填',
              },
            ],
          })(<DatePicker format={'YYYY-MM-DD'} />)}
        </FormItem>
      );
    },
  },
  {
    title: '出入金方向',
    dataIndex: 'paymentDirection',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '出入金方向必填',
              },
            ],
          })(<Select options={PAYMENT_DIRECTION_TYPE_OPTIONS} />)}
        </FormItem>
      );
    },
  },
  {
    title: '账户类型',
    dataIndex: 'accountDirection',
    render: (value, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '账户类型必填',
              },
            ],
          })(<Select options={ACCOUNT_DIRECTION_TYPE_OPTIONS} />)}
        </FormItem>
      );
    },
  },
];
