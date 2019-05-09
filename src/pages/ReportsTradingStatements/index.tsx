import { rptOtcTradeReportPagedByNameAndDate } from '@/services/report-service';
import { Modal } from '@/states/report';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
const ReportsTradingStatements = memo<any>(props => {
  return (
    <Modal
      TABLE_COL_DEFS={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      reportType={'FOF'}
      searchMethod={rptOtcTradeReportPagedByNameAndDate}
      downloadName={'交易报表'}
      scrollWidth={1830}
    />
  );
});

export default ReportsTradingStatements;
