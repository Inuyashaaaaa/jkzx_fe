import { rptPositionReportSearchPaged } from '@/services/report-service';
import ReportCommonTable from '@/containers/ReportCommonTable';
import { PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { formatNumber } from '@/tools';

const getData = async params => {
  const data = await rptPositionReportSearchPaged(params);
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

const ReportsEodPosition = memo<any>(props => {
  return (
    <ReportCommonTable
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      reportType={'LIVE_POSITION_INFO'}
      searchMethod={getData}
      downloadName={'持仓明细'}
      scrollWidth={4000}
      colSwitch={[{ dataIndex: 'productType', options: PRODUCTTYPE_ZHCH_MAP }]}
    />
  );
});

export default ReportsEodPosition;
