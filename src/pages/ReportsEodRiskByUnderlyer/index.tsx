import { rptRiskReportSearchPaged } from '@/services/report-service';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import ReportCommonTable from '@/containers/ReportCommonTable';

const ReportsEodDailyPnlByUnderlyer = memo<any>(props => {
  return (
    <ReportCommonTable
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'bookName'}
      defaultDirection={'asc'}
      reportType={'RISK'}
      searchMethod={rptRiskReportSearchPaged}
      downloadName={'汇总风险'}
      scrollWidth={2100}
    />
  );
});

export default ReportsEodDailyPnlByUnderlyer;
