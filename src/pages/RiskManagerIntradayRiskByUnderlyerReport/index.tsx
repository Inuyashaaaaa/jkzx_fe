import { rptIntradayRiskReportPaged } from '@/services/report-service';
import Modal from '@/states/risk';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';

const RiskManagerIntradayRiskByUnderlyerReport = memo<any>(props => {
  return (
    <Modal
      TABLE_COL_DEFS={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'bookName'}
      defaultDirection={'asc'}
      searchMethod={rptIntradayRiskReportPaged}
      downloadName={'标的风险'}
      scrollWidth={1760}
    />
  );
});

export default RiskManagerIntradayRiskByUnderlyerReport;
