/*eslint-disable */
import React, { memo } from 'react';
import { rptPositionReportSearchPaged } from '@/services/report-service';
import ReportCommonTable from '@/containers/ReportCommonTable';
import { PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';

const ReportsEodPosition = memo<any>(props => (
  <ReportCommonTable
    tableColDefs={TABLE_COL_DEFS}
    searchFormControls={searchFormControls}
    defaultSort="createdAt"
    defaultDirection="desc"
    reportType="LIVE_POSITION_INFO"
    searchMethod={rptPositionReportSearchPaged}
    downloadName="持仓明细"
    scrollWidth={4500}
    colSwitch={[{ dataIndex: 'productType', options: PRODUCTTYPE_ZHCH_MAP }]}
    getSheetDataSourceItemMeta={(val, dataIndex, rowIndex) => {
      if (val === null || val === undefined) {
        return null;
      }
      if (
        [
          'initialNumber',
          'unwindNumber',
          'number',
          'premium',
          'unwindAmount',
          'marketValue',
          'pnl',
          'delta',
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
    }}
  />
));

export default ReportsEodPosition;
