import { rptFinancialOtcFundDetailReportSearchPaged } from '@/services/report-service';
import ReportCommonTable from '@/containers/ReportCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
const ReportsFundsDetailedStatements = memo<any>(props => {
  return (
    <ReportCommonTable
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'paymentDate'}
      defaultDirection={'desc'}
      reportType={'FOT'}
      searchMethod={rptFinancialOtcFundDetailReportSearchPaged}
      downloadName={'资金明细报表'}
      scrollWidth={1350}
    />
  );
});

export default ReportsFundsDetailedStatements;
