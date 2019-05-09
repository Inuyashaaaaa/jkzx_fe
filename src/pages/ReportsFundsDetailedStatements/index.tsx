import { rptFinancialOtcFundDetailReportPagedByNameAndDate } from '@/services/report-service';
import { Modal } from '@/states/report';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
const ReportsFundsDetailedStatements = memo<any>(props => {
  return (
    <Modal
      TABLE_COL_DEFS={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'paymentDate'}
      defaultDirection={'desc'}
      reportType={'FOT'}
      searchMethod={rptFinancialOtcFundDetailReportPagedByNameAndDate}
      downloadName={'资金明细报表'}
      scrollWidth={1350}
    />
  );
});

export default ReportsFundsDetailedStatements;
