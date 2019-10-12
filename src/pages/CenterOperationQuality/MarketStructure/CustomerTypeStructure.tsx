import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import { CustomerTypeStructureDefs } from './constants';
import { getOtcCusTypeReport } from '@/services/terminal';

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
      title="场外衍生品市场客户类型结构"
      formControls={formControls}
      fetchMethod={getOtcCusTypeReport}
      columns={CustomerTypeStructureDefs}
      scrollWidth={{ x: 1250 }}
    />
  </>
);

export default ToolStructure;
