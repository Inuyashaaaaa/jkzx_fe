/*eslint-disable */
import React, { memo } from 'react';
import { rptRiskReportSearchPaged } from '@/services/report-service';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import ReportCommonTable from '@/containers/ReportCommonTable';

const ReportsEodDailyPnlByUnderlyer = memo<any>(props => (
  <ReportCommonTable
    tableColDefs={TABLE_COL_DEFS}
    searchFormControls={searchFormControls}
    defaultSort="bookName"
    defaultDirection="asc"
    reportType="RISK"
    searchMethod={rptRiskReportSearchPaged}
    downloadName="汇总风险"
    scrollWidth={2300}
    getSheetDataSourceItemMeta={(val, dataIndex, rowIndex) => {
      if (val === null || val === undefined) {
        return null;
      }
      if (
        [
          'underlyerPrice',
          'underlyerNetPosition',
          'delta',
          'netDelta',
          'deltaCash',
          'deltaDecay',
          'deltaWithDecay',
          'gamma',
          'gammaCash',
          'vega',
          'theta',
          'rho',
          'underlyerPrice',
        ].includes(dataIndex) &&
        rowIndex > 0
      ) {
        return {
          t: 'n',
          z: Math.abs(val) >= 1000 ? '0,0.0000' : '0.0000',
        };
      }
      if (dataIndex === 'underlyerPriceChangePercent' && rowIndex > 0) {
        return {
          t: 'n',
          z: '0.0000%',
        };
      }
    }}
  />
));

export default ReportsEodDailyPnlByUnderlyer;
