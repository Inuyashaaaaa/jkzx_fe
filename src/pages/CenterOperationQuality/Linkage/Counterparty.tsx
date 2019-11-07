import React from 'react';
import { CounterpartyDefs } from './constants';
import { getOtcEtCusReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const ToolStructure = props => (
  <>
    <ThemeCenterCommonTable
      title="交易对手方联动统计"
      fetchMethod={getOtcEtCusReport}
      columns={CounterpartyDefs}
      scrollWidth={{ x: 1290 }}
      formData={props.formData}
    />
  </>
);

export default ToolStructure;
