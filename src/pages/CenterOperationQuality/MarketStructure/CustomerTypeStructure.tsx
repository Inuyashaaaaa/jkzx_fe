import React from 'react';
import { CustomerTypeStructureDefs } from './constants';
import { getOtcCusTypeReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const ToolStructure = props => (
  <>
    <ThemeCenterCommonTable
      title="场外衍生品市场客户类型结构"
      fetchMethod={getOtcCusTypeReport}
      columns={CustomerTypeStructureDefs}
      scrollWidth={{ x: 1350 }}
      formData={props.formData}
    />
  </>
);

export default ToolStructure;
