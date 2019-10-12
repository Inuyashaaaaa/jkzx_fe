import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import { MarketDefs } from './constants';
import { getOtcEtSubCompanyReport } from '@/services/terminal';

import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const formControls = [
  {
    title: '日期范围',
    dataIndex: 'date',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({ rules: [{ required: true, message: '日期范围必填' }] })(
          <ThemeDatePickerRanger allowClear={false}></ThemeDatePickerRanger>,
        )}
      </FormItem>
    ),
  },
];

const ToolStructure = () => (
  <>
    <ThemeCenterCommonTable
      title="子公司联动统计"
      formControls={formControls}
      fetchMethod={getOtcEtSubCompanyReport}
      scrollWidth={{ x: 1000 }}
      columns={MarketDefs}
    />
  </>
);

export default ToolStructure;
