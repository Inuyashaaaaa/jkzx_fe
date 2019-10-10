/*eslint-disable */
import React, { memo } from 'react';
import { rptIntradayPnlReportSearchPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { socketHOC } from '@/tools/socketHOC';

const Wrapper = socketHOC('PNL')(RiskCommonTable);

const RiskManagerIntradayDailyPnlByUnderlyerReport = memo<any>(props => (
  <Wrapper
    id="real_time_pnl_dag"
    tableColDefs={TABLE_COL_DEFS}
    searchFormControls={searchFormControls}
    defaultSort="bookName"
    defaultDirection="asc"
    searchMethod={rptIntradayPnlReportSearchPaged}
    downloadName="标的盈亏"
    scrollWidth={1600}
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
  />
));

export default RiskManagerIntradayDailyPnlByUnderlyerReport;
