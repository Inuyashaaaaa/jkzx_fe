import React from 'react';
import { ControlRiskDefs } from './constants';
import { getOtcMarketManipulateReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const ToolStructure = props => (
  <>
    <ThemeCenterCommonTable
      title="场外衍生品市场操纵风险监测"
      fetchMethod={getOtcMarketManipulateReport}
      columns={ControlRiskDefs}
      scrollWidth={{ x: 700 }}
      formData={props.formData}
    />
  </>
);

export default ToolStructure;
