import { DatePicker, Input } from '@/containers';
import { IFormColDef } from '@/components/type';
import { getMoment } from '@/tools';
import FormItem from 'antd/lib/form/FormItem';
import _ from 'lodash';
import React from 'react';
import { HOLIDAY_FORMAT } from './constants';

export const createFormControls: (data: any[]) => IFormColDef[] = tableDataSource => [
  {
    dataIndex: 'holiday',
    title: '日期',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '日期必须填写',
              },
              {
                validator: (rule, value, callback) => {
                  const val = value.format(HOLIDAY_FORMAT);
                  if (_.map(tableDataSource, 'holiday').indexOf(val) !== -1) {
                    callback(true);
                  }
                  callback();
                },
                message: '日期不可以重复',
              },
            ],
          })(<DatePicker format="YYYY-MM-DD" />)}
        </FormItem>
      );
    },
  },
  {
    dataIndex: 'note',
    title: '备注',
    render: (val, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator()(<Input />)}</FormItem>;
    },
  },
];
