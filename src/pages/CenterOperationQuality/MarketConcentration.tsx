import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import { MarketConcentrationDefs } from './constants';
import { rptSearchPagedMarketRiskDetailReport } from '@/services/report-service';

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

const MarketConcentration = () => (
  <>
    <ThemeCenterCommonTable
      title="场外衍生品市场集中度"
      formControls={formControls}
      fetchMethod={rptSearchPagedMarketRiskDetailReport}
      columns={MarketConcentrationDefs}
    />
  </>
);

export default MarketConcentration;
