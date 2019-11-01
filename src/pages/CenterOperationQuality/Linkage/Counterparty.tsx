import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import styled from 'styled-components';
import moment from 'moment';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import { CounterpartyDefs } from './constants';
import { getOtcEtCusReport } from '@/services/terminal';

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
            <ThemeDatePickerRanger
              allowClear={false}
              disabledDate={current => current && current > moment()}
            ></ThemeDatePickerRanger>,
          )}
        </FormItem>
      </ThemeFormItemWrap>
    ),
  },
];

const ToolStructure = () => (
  <>
    <ThemeCenterCommonTable
      title="交易对手方联动统计"
      formControls={formControls}
      fetchMethod={getOtcEtCusReport}
      columns={CounterpartyDefs}
      scrollWidth={{ x: 1400 }}
    />
  </>
);

export default ToolStructure;
