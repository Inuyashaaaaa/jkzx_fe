import React, { memo } from 'react';
import { rptPnlReportSearchPaged } from '@/services/report-service';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import ReportCommonTable from '@/containers/ReportCommonTable';

const ReportsEodDailyPnlByUnderlyer = memo<any>(props => (
  <ReportCommonTable
    tableColDefs={TABLE_COL_DEFS}
    searchFormControls={searchFormControls}
    defaultSort="bookName"
    defaultDirection="asc"
    reportType="PNL"
    searchMethod={rptPnlReportSearchPaged}
    downloadName="汇总日盈亏"
    scrollWidth={1550}
  />
));

export default ReportsEodDailyPnlByUnderlyer;
