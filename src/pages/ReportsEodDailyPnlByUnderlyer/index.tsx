/* eslint-disable */
import React, { memo } from 'react';
import { rptPnlReportSearchPaged } from '@/services/report-service';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import ReportCommonTable from '@/containers/ReportCommonTable';

const ReportsEodDailyPnlByUnderlyer = memo<any>(props => (
  <ReportCommonTable
    tableColDefs={TABLE_COL_DEFS}
    searchFormControls={searchFormControls}
    defaultSort="bookName"
    getSheetDataSourceItemMeta={(val, dataIndex, rowIndex) => {
      if (val === null || val === undefined) {
        return null;
      }
      if (
        [
          'dailyPnl',
          'dailyOptionPnl',
          'dailyUnderlyerPnl',
          'pnlContributionDelta',
          'pnlContributionGamma',
          'pnlContributionVega',
          'pnlContributionTheta',
          'pnlContributionRho',
          'pnlContributionUnexplained',
        ].includes(dataIndex) &&
        rowIndex > 0
      ) {
        return {
          t: 'n',
          z: Math.abs(val) >= 1000 ? '0,0.0000' : '0.0000',
        };
      }
    }}
    defaultDirection="asc"
    reportType="PNL"
    searchMethod={rptPnlReportSearchPaged}
    downloadName="汇总日盈亏"
    scrollWidth={2000}
  />
));

export default ReportsEodDailyPnlByUnderlyer;
