import { rptFinanicalOtcClientFundReportSearchPaged } from '@/services/report-service';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import ReportCommonTable from '@/containers/ReportCommonTable';

const ReportsCustomerFundsSummaryStatements = memo<any>(props => {
  return (
    <ReportCommonTable
      antd={true}
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'clientName'}
      defaultDirection={'asc'}
      reportType={'FOC'}
      searchMethod={rptFinanicalOtcClientFundReportSearchPaged}
      downloadName={'客户资金汇总报表'}
      scrollWidth={1350}
      bordered={true}
    />
  );
});

export default ReportsCustomerFundsSummaryStatements;
