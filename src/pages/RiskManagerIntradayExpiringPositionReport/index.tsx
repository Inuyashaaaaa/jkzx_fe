/*eslint-disable */
import React, { memo } from 'react';
import { rptIntradayTradeExpiringReportPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import { TABLE_COL_DEFS } from './constants';
import { socketHOC } from '@/tools/socketHOC';
import { PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';

const Wrapper = socketHOC('EXPIRING_POSITION')(RiskCommonTable);

const RiskManagerIntradayExpiringPositionReport = memo<any>(props => (
  <Wrapper
    id="real_time_expiring_position_dag"
    tableColDefs={TABLE_COL_DEFS}
    defaultSort="tradeDate"
    defaultDirection="desc"
    searchMethod={rptIntradayTradeExpiringReportPaged}
    downloadName="到期合约"
    scrollWidth={3000}
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

export default RiskManagerIntradayExpiringPositionReport;
