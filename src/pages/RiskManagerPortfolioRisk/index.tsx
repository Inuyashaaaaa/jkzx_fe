/*eslint-disable */
import React, { memo } from 'react';
import { rptIntradayPortfolioRiskReportSearchPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { socketHOC } from '@/tools/socketHOC';

const Wrapper = socketHOC('PORTFOLIO_RISK')(RiskCommonTable);

const RiskManagerPortfolioRisk = memo<any>(props => (
  <Wrapper
    id="real_time_portfolio_risk_dag"
    tableColDefs={TABLE_COL_DEFS}
    searchFormControls={searchFormControls}
    defaultSort="portfolioName"
    defaultDirection="asc"
    searchMethod={rptIntradayPortfolioRiskReportSearchPaged}
    downloadName="投资组合风险"
    scrollWidth={1350}
    getSheetDataSourceItemMeta={(val, dataIndex, rowIndex) => {
      if (val === null || val === undefined) {
        return null;
      }
      if (['deltaCash', 'gammaCash', 'rho', 'theta', 'vega'].includes(dataIndex) && rowIndex > 0) {
        return {
          t: 'n',
          z: Math.abs(val) >= 1000 ? '0,0.0000' : '0.0000',
        };
      }
    }}
  />
));

export default RiskManagerPortfolioRisk;
