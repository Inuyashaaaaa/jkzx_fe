import { rptIntradayPnlReportPaged } from '@/services/report-service';
import Modal from '@/states/risk';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';

const RiskManagerIntradayDailyPnlByUnderlyerReport = memo<any>(props => {
  return (
    <Modal
      TABLE_COL_DEFS={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'bookName'}
      defaultDirection={'asc'}
      searchMethod={rptIntradayPnlReportPaged}
      downloadName={'标的盈亏'}
      scrollWidth={1350}
    />
  );
});

export default RiskManagerIntradayDailyPnlByUnderlyerReport;
