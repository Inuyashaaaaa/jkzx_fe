import { rptIntradayTradeReportSearchPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';

const RiskManagerIntradayPositionReport = memo<any>(props => {
  return (
    <RiskCommonTable
      id="real_time_valuation_dag"
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      searchMethod={rptIntradayTradeReportSearchPaged}
      downloadName={'持仓明细'}
      scrollWidth={3450}
    />
  );
});

export default RiskManagerIntradayPositionReport;
