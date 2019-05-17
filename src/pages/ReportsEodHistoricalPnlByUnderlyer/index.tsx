import { rptPnlHstReportSearchPaged } from '@/services/report-service';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import ReportCommonTable from '@/containers/ReportCommonTable';

const ReportsEodHistoricalPnlByUnderlyer = memo<any>(props => {
  return (
    <ReportCommonTable
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'bookName'}
      defaultDirection={'asc'}
      reportType={'PNL_HST'}
      searchMethod={rptPnlHstReportSearchPaged}
      downloadName={'历史盈亏'}
      scrollWidth={2000}
    />
  );
});

export default ReportsEodHistoricalPnlByUnderlyer;
