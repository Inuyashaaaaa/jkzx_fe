/*eslint-disable */
import React, { memo } from 'react';
import BigNumber from 'bignumber.js';
import { rptFinanicalOtcClientFundReportSearchPaged } from '@/services/report-service';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';
import ReportCommonTable from '@/containers/ReportCommonTable';

const ReportsCustomerFundsSummaryStatements = memo<any>(props => (
  <ReportCommonTable
    antd
    tableColDefs={TABLE_COL_DEFS}
    searchFormControls={searchFormControls}
    defaultSort="clientName"
    defaultDirection="asc"
    reportType="FOC"
    searchMethod={rptFinanicalOtcClientFundReportSearchPaged}
    downloadName="客户资金汇总报表"
    scrollWidth={1350}
    bordered
    getSheetDataSourceItemMeta={(val, dataIndex, rowIndex) => {
      if (val === null || val === undefined) {
        return null;
      }
      if (
        [
          'paymentIn',
          'paymentOut',
          'premiumBuy',
          'premiumSell',
          'profitAmount',
          'lossAmount',
          'fundTotal',
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

export default ReportsCustomerFundsSummaryStatements;
