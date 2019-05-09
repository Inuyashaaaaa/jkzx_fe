import { rptPnlHstReportPagedByNameAndDate } from '@/services/report-service';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { Modal } from '@/states/report';

const ReportsEodHistoricalPnlByUnderlyer = memo<any>(props => {
  return (
    <Modal
      TABLE_COL_DEFS={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'bookName'}
      defaultDirection={'asc'}
      reportType={'PNL_HST'}
      searchMethod={rptPnlHstReportPagedByNameAndDate}
      downloadName={'历史盈亏'}
      scrollWidth={1600}
    />
  );
});

export default ReportsEodHistoricalPnlByUnderlyer;
