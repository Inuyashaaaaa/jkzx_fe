import React from 'react';
import { KnockdownStructureDefs } from './constants';
import { getOtcTradeSummaryReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const ToolStructure = props => (
  <>
    <ThemeCenterCommonTable
      title="场外衍生品市场成交结构"
      fetchMethod={getOtcTradeSummaryReport}
      columns={KnockdownStructureDefs}
      scrollWidth={{ x: 2700 }}
      formData={props.formData}
    />
  </>
);

export default ToolStructure;
