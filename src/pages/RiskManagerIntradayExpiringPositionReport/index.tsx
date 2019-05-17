import { rptIntradayTradeExpiringReportPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { socketHOC } from '@/tools/socketHOC';

const Wrapper = socketHOC('EXPIRING_POSITION')(RiskCommonTable);

const RiskManagerIntradayExpiringPositionReport = memo<any>(props => {
  return (
    <Wrapper
      id="real_time_expiring_position_dag"
      tableColDefs={TABLE_COL_DEFS}
      defaultSort={'tradeDate'}
      defaultDirection={'desc'}
      searchMethod={rptIntradayTradeExpiringReportPaged}
      downloadName={'到期合约'}
      scrollWidth={2800}
    />
  );
});

export default RiskManagerIntradayExpiringPositionReport;
