import { rptRiskReportPagedByNameAndDate } from '@/services/report-service';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { Modal } from '@/states/report';

const ReportsEodDailyPnlByUnderlyer = memo<any>(props => {
  return (
    <Modal
      TABLE_COL_DEFS={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'bookName'}
      defaultDirection={'asc'}
      reportType={'RISK'}
      searchMethod={rptRiskReportPagedByNameAndDate}
      downloadName={'汇总风险'}
      scrollWidth={1760}
    />
  );
});

export default ReportsEodDailyPnlByUnderlyer;
