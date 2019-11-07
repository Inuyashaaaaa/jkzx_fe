import React from 'react';
import { VarietiesDefs } from './constants';
import { getOtcEtCommodityReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const ToolStructure = props => (
  <>
    <ThemeCenterCommonTable
      title="场内外品种联动统计"
      fetchMethod={getOtcEtCommodityReport}
      columns={VarietiesDefs}
      scrollWidth={{ x: 1450 }}
      formData={props.formData}
    />
  </>
);

export default ToolStructure;
