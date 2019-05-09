import { rptIntradayRiskReportSearchPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';

const RiskManagerIntradayRiskByUnderlyerReport = memo<any>(props => {
  return (
    <RiskCommonTable
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'bookName'}
      defaultDirection={'asc'}
      searchMethod={rptIntradayRiskReportSearchPaged}
      downloadName={'标的风险'}
      scrollWidth={1760}
    />
  );
});

export default RiskManagerIntradayRiskByUnderlyerReport;
