import { rptPositionReportSearchPaged } from '@/services/report-service';
import ReportCommonTable from '@/containers/ReportCommonTable';
import { PRODUCTTYPE_ZHCH_MAP } from '@/constants/common';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';

const ReportsEodPosition = memo<any>(props => {
  return (
    <ReportCommonTable
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      reportType={'LIVE_POSITION_INFO'}
      searchMethod={rptPositionReportSearchPaged}
      downloadName={'持仓明细'}
      scrollWidth={4500}
      colSwitch={[{ dataIndex: 'productType', options: PRODUCTTYPE_ZHCH_MAP }]}
    />
  );
});

export default ReportsEodPosition;
