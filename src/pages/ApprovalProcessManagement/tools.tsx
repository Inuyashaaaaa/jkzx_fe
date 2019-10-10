import React from 'react';
import _ from 'lodash';
import FormItem from 'antd/lib/form/FormItem';
import { Row, Col } from 'antd';
import {
  processNum,
  processName,
  initiatorName,
  subject,
  startTime,
  operatorName,
  pendingCol,
  taskName,
  person,
  operation,
  operateTime,
  comment,
} from './constants';
import Operation from './Operation';
import {
  PROCESS_STATUS_TYPE_OPTIONS_LOW,
  ACCOUNT_DIRECTION_TYPE_OPTIONS,
  PAYMENT_DIRECTION_TYPE_OPTIONS,
} from '@/constants/common';

import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { IFormColDef } from '@/components/type';
import { Select, InputNumber, DatePicker } from '@/containers';
import { formatNum } from '@/tools';
import styles from './index.less';

const { Option } = Select;

export const PENDING_COL_DEFS = fetchTable => [
  ...pendingCol,
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 200,
    render: (text, params, index) => (
      <Operation formData={params} status="pending" fetchTable={fetchTable} />
    ),
  },
];

export const RELATED_COL_DEFS = fetchTable => [
  ...pendingCol,
  {
    dataIndex: 'processInstanceStatusEnum',
    title: '流程状态',
    width: 160,
    render: (text, params, index) => {
      if (!text) return text;
      const iindex = _.findIndex(PROCESS_STATUS_TYPE_OPTIONS_LOW, item => item.value === text);
      if (iindex < 0) return text;
      return PROCESS_STATUS_TYPE_OPTIONS_LOW[iindex].label;
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 250,
    render: (text, params, index) => (
      <Operation formData={params} status="related" fetchTable={fetchTable} />
    ),
  },
];

export function generateColumns(type, tag) {
  if (type === 'approval') {
    const columns =
      tag === 'initiator'
        ? [processNum, processName, initiatorName, subject, startTime]
        : [processNum, processName, operatorName, subject, startTime];

    return columns.map(item => {
      const obj = {
        title: item.title,
        key: item.dataIndex,
        dataIndex: item.dataIndex,
      };
      if (item.dataIndex === 'processSequenceNum') {
        obj.width = 120;
      }
      return obj;
    });
  }

  if (type === 'process') {
    return [taskName, person, operation, operateTime, comment];
  }
  return null;
}

export const CREATE_FORM_CONTROLS: (bankAccountList, disabled) => IFormColDef[] = (
  bankAccountList,
  disabled,
) => [
  {
    title: '交易对手',
    dataIndex: 'clientId',
    render: (value, record, index, { form }) => (
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
            showSearch
            allowClear
            disabled={disabled}
            fetchOptionsOnSearch
            options={async (val: string = '') => {
              const { data, error } = await refSimilarLegalNameList({
                similarLegalName: val,
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
    title: '交易对手银行账号',
    dataIndex: 'bankAccount',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '交易对手银行账号必填',
            },
          ],
        })(
          <Select allowClear className={styles.bankAccount} disabled={disabled}>
            {bankAccountList.map(item => (
              <Option value={item.value} title={item.label} key={item.value}>
                <Row>{item.label}</Row>
                <Row
                  style={{
                    color: 'rgba(0, 0, 0, 0.35)',
                  }}
                >
                  <Col>账户名: {item.bankAccountName ? item.bankAccountName : '-'}</Col>
                  <Col>开户行: {item.bankName ? item.bankName : '-'}</Col>
                </Row>
              </Option>
            ))}
          </Select>,
        )}
      </FormItem>
    ),
  },
  {
    title: '出入金金额',
    dataIndex: 'paymentAmount',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '出入金金额必填',
            },
          ],
        })(
          <InputNumber
            disabled={disabled}
            formatter={val => val && formatNum(String(val))}
            precision={2}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '出入金日期',
    dataIndex: 'paymentDate',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '出入金日期必填',
            },
          ],
        })(<DatePicker format="YYYY-MM-DD" disabled={disabled} />)}
      </FormItem>
    ),
  },
  {
    title: '出入金方向',
    dataIndex: 'paymentDirection',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '出入金方向必填',
            },
          ],
        })(<Select disabled={disabled} options={PAYMENT_DIRECTION_TYPE_OPTIONS} />)}
      </FormItem>
    ),
  },
  {
    title: '账户类型',
    dataIndex: 'accountDirection',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '账户类型必填',
            },
          ],
        })(<Select disabled={disabled} options={ACCOUNT_DIRECTION_TYPE_OPTIONS} />)}
      </FormItem>
    ),
  },
];
