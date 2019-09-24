/*eslint-disable */
import React, { memo } from 'react';
import { rptPnlHstReportSearchPaged } from '@/services/report-service';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import ReportCommonTable from '@/containers/ReportCommonTable';

const ReportsEodHistoricalPnlByUnderlyer = memo<any>(props => (
  <ReportCommonTable
    tableColDefs={TABLE_COL_DEFS}
    searchFormControls={searchFormControls}
    defaultSort="bookName"
    defaultDirection="asc"
    reportType="PNL_HST"
    searchMethod={rptPnlHstReportSearchPaged}
    downloadName="历史盈亏"
    scrollWidth={2200}
    getSheetDataSourceItemMeta={(val, dataIndex, rowIndex) => {
      if (val === null || val === undefined) {
        return null;
      }
      if (
        [
          'pnl',
          'optionPremium',
          'optionUnwindAmount',
          'optionSettleAmount',
          'optionMarketValue',
          'optionPnl',
          'underlyerBuyAmount',
          'underlyerSellAmount',
          'underlyerPrice',
          'underlyerMarketValue',
          'underlyerPnl',
          'underlyerNetPosition',
        ].includes(dataIndex) &&
        rowIndex > 0
      ) {
        return {
          t: 'n',
          z: Math.abs(val) >= 1000 ? '0,0.0000' : '0.0000',
        };
      }
    }}
  />
));

export default ReportsEodHistoricalPnlByUnderlyer;
