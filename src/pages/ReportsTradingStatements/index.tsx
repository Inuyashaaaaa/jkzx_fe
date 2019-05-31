import { rptOtcTradeReportSearchPaged } from '@/services/report-service';
import ReportCommonTable from '@/containers/ReportCommonTable';
import React, { memo } from 'react';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { DIRECTION_ZHCN_MAP, ASSET_TYPE_ZHCN_MAP } from '@/constants/common';
const ReportsTradingStatements = memo<any>(props => {
  return (
    <ReportCommonTable
      tableColDefs={TABLE_COL_DEFS}
      searchFormControls={searchFormControls}
      defaultSort={'createdAt'}
      defaultDirection={'desc'}
      reportType={'FOF'}
      searchMethod={rptOtcTradeReportSearchPaged}
      downloadName={'交易报表'}
      scrollWidth={1830}
      colSwitch={[
        { dataIndex: 'side', options: DIRECTION_ZHCN_MAP },
        { dataIndex: 'assetType', options: ASSET_TYPE_ZHCN_MAP },
      ]}
    />
  );
});

export default ReportsTradingStatements;
