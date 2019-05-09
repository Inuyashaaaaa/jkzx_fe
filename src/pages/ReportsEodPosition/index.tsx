import { rptPositionReportSearchPaged } from '@/services/report-service';
import { Modal } from '@/states/report';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
const ReportsEodPosition = memo<any>(props => {
  return (
    <Modal
      TABLE_COL_DEFS={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      reportType={'LIVE_POSITION_INFO'}
      searchMethod={rptPositionReportSearchPaged}
      downloadName={'持仓明细'}
      scrollWidth={3320}
    />
  );
});

export default ReportsEodPosition;
