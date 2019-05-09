import { rptIntradayTradeExpiringReportPaged } from '@/services/report-service';
import Modal from '@/states/risk';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';

const RiskManagerIntradayExpiringPositionReport = memo<any>(props => {
  return (
    <Modal
      TABLE_COL_DEFS={TABLE_COL_DEFS}
      defaultSort={'tradeDate'}
      defaultDirection={'desc'}
      searchMethod={rptIntradayTradeExpiringReportPaged}
      downloadName={'到期合约'}
      scrollWidth={2800}
    />
  );
});

export default RiskManagerIntradayExpiringPositionReport;
