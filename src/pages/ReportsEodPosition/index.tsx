import { rptPositionReportSearchPaged } from '@/services/report-service';
import ReportCommonTable from '@/containers/ReportCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
const ReportsEodPosition = memo<any>(props => {
  return (
    <ReportCommonTable
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      reportType={'LIVE_POSITION_INFO'}
      searchMethod={rptPositionReportSearchPaged}
      downloadName={'持仓明细'}
      scrollWidth={3450}
    />
  );
});

export default ReportsEodPosition;
