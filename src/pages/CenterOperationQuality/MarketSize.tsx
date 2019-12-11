import React from 'react';
import { MarketSizeDefs } from './constants';
import { getOtcSummaryReport } from '@/services/terminal';
import ThemeCenterCommonTable from '@/containers/ThemeCenterCommonTable';

const MarketSize = props => (
  <>
    <ThemeCenterCommonTable
      title="场外衍生品市场规模概况"
      fetchMethod={getOtcSummaryReport}
      scrollWidth={{ x: 1770 }}
      columns={MarketSizeDefs}
      formData={props.formData}
    />
  </>
);

export default MarketSize;
