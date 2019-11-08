import React from 'react';
import { MarketConcentrationDefs } from './constants';
import { getOtcMarketDistReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const MarketConcentration = props => (
  <>
    <ThemeCenterCommonTable
      title="场外衍生品市场集中度"
      fetchMethod={getOtcMarketDistReport}
      columns={MarketConcentrationDefs}
      scrollWidth={{ x: 1640 }}
      formData={props.formData}
    />
  </>
);

export default MarketConcentration;
