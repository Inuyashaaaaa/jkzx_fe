import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import styled from 'styled-components';
import ThemeDatePickerRanger from '@/containers/ThemeDatePickerRanger';
import { ToolStructureDefs } from './constants';
import { getOtcAssetToolReport } from '@/services/terminal';

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

const ToolStructure = () => (
  <>
    <ThemeCenterCommonTable
      title="场外衍生品市场资产和工具结构"
      formControls={formControls}
      fetchMethod={getOtcAssetToolReport}
      columns={ToolStructureDefs}
      scrollWidth={{ x: 1450 }}
    />
  </>
);

export default ToolStructure;
