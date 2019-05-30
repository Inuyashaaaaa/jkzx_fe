import { rptIntradayRiskReportSearchPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { socketHOC } from '@/tools/socketHOC';

const Wrapper = socketHOC('RISK')(RiskCommonTable);

const RiskManagerIntradayRiskByUnderlyerReport = memo<any>(props => {
  return (
    <Wrapper
      id="real_time_risk_dag"
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'bookName'}
      defaultDirection={'asc'}
      searchMethod={rptIntradayRiskReportSearchPaged}
      downloadName={'标的风险'}
      scrollWidth={1900}
    />
  );
});

export default RiskManagerIntradayRiskByUnderlyerReport;
