import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import styled from 'styled-components';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import { MarketSizeDefs } from './constants';
import { getOtcSummaryReport } from '@/services/terminal';

import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const ThemeFormItemWrap = styled.div`
  label {
    font-size: 16px;
  }
`;

const formControls = [
  {
    title: '日期范围',
    dataIndex: 'date',
    render: (val, record, index, { form }) => (
      <ThemeFormItemWrap>
        <FormItem>
          {form.getFieldDecorator({ rules: [{ required: true, message: '日期范围必填' }] })(
            <ThemeDatePickerRanger allowClear={false}></ThemeDatePickerRanger>,
          )}
        </FormItem>
      </ThemeFormItemWrap>
    ),
  },
];

const MarketSize = () => (
  <>
    <ThemeCenterCommonTable
      title="场外衍生品市场规模概况"
      formControls={formControls}
      fetchMethod={getOtcSummaryReport}
      scrollWidth={{ x: 1780 }}
      columns={MarketSizeDefs}
    />
  </>
);

export default MarketSize;
