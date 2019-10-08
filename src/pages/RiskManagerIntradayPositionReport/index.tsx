/*eslint-disable */
import React, { memo } from 'react';
import { rptIntradayTradeReportSearchPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { socketHOC } from '@/tools/socketHOC';
import { PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';

const Wrapper = socketHOC('VALUATION')(RiskCommonTable);

const RiskManagerIntradayPositionReport = memo<any>(props => (
  <Wrapper
    id="real_time_valuation_dag"
    tableColDefs={TABLE_COL_DEFS}
    searchFormControls={searchFormControls}
    defaultSort="createdAt"
    defaultDirection="desc"
    searchMethod={rptIntradayTradeReportSearchPaged}
    downloadName="持仓明细"
    scrollWidth={4050}
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
          'rho',
          'theta',
          'vega',
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

export default RiskManagerIntradayPositionReport;
