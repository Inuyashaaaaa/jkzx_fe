import React from 'react';
import { MarketDefs } from './constants';
import { getOtcEtSubCompanyReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const ToolStructure = props => (
  <>
    <ThemeCenterCommonTable
      title="子公司联动统计"
      fetchMethod={getOtcEtSubCompanyReport}
      scrollWidth={{ x: 940 }}
      columns={MarketDefs}
      formData={props.formData}
    />
  </>
);

export default ToolStructure;
