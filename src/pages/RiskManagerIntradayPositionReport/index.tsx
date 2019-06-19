import { rptIntradayTradeReportSearchPaged } from '@/services/report-service';
import RiskCommonTable from '@/containers/RiskCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { socketHOC } from '@/tools/socketHOC';
import { PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';
import { formatNumber } from '@/tools';

const Wrapper = socketHOC('VALUATION')(RiskCommonTable);

const getData = async params => {
  const data = await rptIntradayTradeReportSearchPaged(params);
  return new Promise(resolve => {
    if (data.data && data.data.page) {
      data.data.page.forEach(v => {
        if (v.vol === +v.vol) {
          v.vol = formatNumber(v.vol * 100, 2) + '%';
        }
        if (v.r === +v.r) {
          v.r = formatNumber(v.r * 100, 2) + '%';
        }
        if (v.q === +v.q) {
          v.q = formatNumber(v.q * 100, 2) + '%';
        }
      });
    }
    resolve(data);
  });
};

const RiskManagerIntradayPositionReport = memo<any>(props => {
  return (
    <Wrapper
      id="real_time_valuation_dag"
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      searchMethod={getData}
      downloadName={'持仓明细'}
      scrollWidth={4050}
      colSwitch={[{ dataIndex: 'productType', options: PRODUCTTYPE_ZHCH_MAP }]}
    />
  );
});

export default RiskManagerIntradayPositionReport;
