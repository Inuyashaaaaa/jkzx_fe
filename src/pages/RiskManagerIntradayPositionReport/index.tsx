import { rptIntradayTradeReportSearchPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { socketHOC } from '@/tools/socketHOC';
import { PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';

const Wrapper = socketHOC('VALUATION')(RiskCommonTable);

const RiskManagerIntradayPositionReport = memo<any>(props => {
  return (
    <Wrapper
      id="real_time_valuation_dag"
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      searchMethod={rptIntradayTradeReportSearchPaged}
      downloadName={'持仓明细'}
      scrollWidth={4050}
      colSwitch={[{ dataIndex: 'productType', options: PRODUCTTYPE_ZHCH_MAP }]}
    />
  );
});

export default RiskManagerIntradayPositionReport;
