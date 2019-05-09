import { rptPnlReportPagedByNameAndDate } from '@/services/report-service';
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
      reportType={'PNL'}
      searchMethod={rptPnlReportPagedByNameAndDate}
      downloadName={'汇总日盈亏'}
      scrollWidth={1550}
    />
  );
});

export default ReportsEodDailyPnlByUnderlyer;
