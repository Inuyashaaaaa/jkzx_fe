import React from 'react';
import { PositionProportionDefs } from './constants';
import { getOtcCusPosPercentageReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const PositionProportion = props => (
  <>
    <ThemeCenterCommonTable
      title="对手方场内外合并持仓占比"
      fetchMethod={getOtcCusPosPercentageReport}
      columns={PositionProportionDefs}
      scrollWidth={{ x: 2160 }}
      formData={props.formData}
    />
  </>
);

export default PositionProportion;
