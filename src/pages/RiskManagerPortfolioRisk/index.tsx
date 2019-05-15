import { rptIntradayPortfolioRiskReportSearchPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { socketHOC } from '@/tools/socketHOC';

const Wrapper = socketHOC('PORTFOLIO_RISK')(RiskCommonTable);

const RiskManagerPortfolioRisk = memo<any>(props => {
  return (
    <Wrapper
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'portfolioName'}
      defaultDirection={'asc'}
      searchMethod={rptIntradayPortfolioRiskReportSearchPaged}
      downloadName={'投资组合风险'}
      scrollWidth={1350}
      hideReload={true}
    />
  );
});

export default RiskManagerPortfolioRisk;
