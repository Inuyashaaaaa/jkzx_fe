import { rptIntradayTradeReportPaged } from '@/services/report-service';
import Modal from '@/states/risk';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';

const RiskManagerIntradayPositionReport = memo<any>(props => {
  return (
    <Modal
      TABLE_COL_DEFS={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      reportType={'LIVE_POSITION_INFO'}
      searchMethod={rptIntradayTradeReportPaged}
      downloadName={'持仓明细'}
      scrollWidth={3320}
    />
  );
});

export default RiskManagerIntradayPositionReport;
