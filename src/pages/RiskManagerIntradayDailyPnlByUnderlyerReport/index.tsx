import { rptIntradayPnlReportSearchPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { socketHOC } from '@/tools/socketHOC';

const Wrapper = socketHOC('PNL')(RiskCommonTable);

const RiskManagerIntradayDailyPnlByUnderlyerReport = memo<any>(props => {
  return (
    <Wrapper
      id="real_time_pnl_dag"
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'bookName'}
      defaultDirection={'asc'}
      searchMethod={rptIntradayPnlReportSearchPaged}
      downloadName={'标的盈亏'}
      scrollWidth={1350}
    />
  );
});

export default RiskManagerIntradayDailyPnlByUnderlyerReport;
