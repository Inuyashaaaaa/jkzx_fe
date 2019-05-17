import { rptOtcTradeReportSearchPaged } from '@/services/report-service';
import ReportCommonTable from '@/containers/ReportCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
const ReportsTradingStatements = memo<any>(props => {
  return (
    <ReportCommonTable
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      reportType={'FOF'}
      searchMethod={rptOtcTradeReportSearchPaged}
      downloadName={'交易报表'}
      scrollWidth={1830}
    />
  );
});

export default ReportsTradingStatements;
