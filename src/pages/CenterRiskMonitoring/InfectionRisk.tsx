import React from 'react';
import { InfectionRiskDefs } from './constants';
import { getOtcCompPropagateReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const ToolStructure = props => (
  <>
    <ThemeCenterCommonTable
      title="场外衍生品市场子公司传染风险监测"
      fetchMethod={getOtcCompPropagateReport}
      columns={InfectionRiskDefs}
      scrollWidth={{ x: 1650 }}
      formData={props.formData}
    />
  </>
);

export default ToolStructure;
