/*eslint-disable */
import React, { memo } from 'react';
import { rptOtcTradeReportSearchPaged } from '@/services/report-service';
import ReportCommonTable from '@/containers/ReportCommonTable';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import { DIRECTION_ZHCN_MAP, ASSET_TYPE_ZHCN_MAP } from '@/constants/common';

const ReportsTradingStatements = memo<any>(props => (
  <ReportCommonTable
    tableColDefs={TABLE_COL_DEFS}
    searchFormControls={searchFormControls}
    defaultSort="createdAt"
    defaultDirection="desc"
    reportType="FOF"
    searchMethod={rptOtcTradeReportSearchPaged}
    downloadName="交易报表"
    scrollWidth={1900}
    colSwitch={[
      { dataIndex: 'side', options: DIRECTION_ZHCN_MAP },
      { dataIndex: 'assetType', options: ASSET_TYPE_ZHCN_MAP },
    ]}
    getSheetDataSourceItemMeta={(val, dataIndex, rowIndex) => {
      if (val === null || val === undefined) {
        return null;
      }
      if (
        ['nominalPrice', 'beginPremium', 'endPremium', 'totalPremium'].includes(dataIndex) &&
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

export default ReportsTradingStatements;
