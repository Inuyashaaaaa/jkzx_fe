import { rptFinanicalOtcClientFundReportPagedByNameAndDate } from '@/services/report-service';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { Modal } from '@/states/report';

const ReportsCustomerFundsSummaryStatements = memo<any>(props => {
  return (
    <Modal
      TABLE_COL_DEFS={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'clientName'}
      defaultDirection={'asc'}
      reportType={'FOC'}
      searchMethod={rptFinanicalOtcClientFundReportPagedByNameAndDate}
      downloadName={'客户资金汇总报表'}
      scrollWidth={1350}
      bordered={true}
    />
  );
});

export default ReportsCustomerFundsSummaryStatements;
