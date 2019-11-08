import React from 'react';
import { PositionStructureDefs } from './constants';
import { getOtcPositionSummaryReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const ToolStructure = props => (
  <>
    <ThemeCenterCommonTable
      title="场外衍生品市场持仓结构"
      fetchMethod={getOtcPositionSummaryReport}
      columns={PositionStructureDefs}
      scrollWidth={{ x: 3190 }}
      formData={props.formData}
    />
  </>
);

export default ToolStructure;
