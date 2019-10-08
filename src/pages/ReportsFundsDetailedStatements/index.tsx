/*eslint-disable */
import React, { memo } from 'react';
import { rptFinancialOtcFundDetailReportSearchPaged } from '@/services/report-service';
import ReportCommonTable from '@/containers/ReportCommonTable';
import { TABLE_COL_DEFS } from './constants';
import { searchFormControls } from './services';

const ReportsFundsDetailedStatements = memo<any>(props => (
  <ReportCommonTable
    tableColDefs={TABLE_COL_DEFS}
    searchFormControls={searchFormControls}
    defaultSort="paymentDate"
    defaultDirection="desc"
    reportType="FOT"
    searchMethod={rptFinancialOtcFundDetailReportSearchPaged}
    downloadName="资金明细报表"
    scrollWidth={1350}
    getSheetDataSourceItemMeta={(val, dataIndex, rowIndex) => {
      if (val === null || val === undefined) {
        return null;
      }
      if (['paymentIn', 'paymentOut', 'paymentAmount'].includes(dataIndex) && rowIndex > 0) {
        return {
          t: 'n',
          z: Math.abs(val) >= 1000 ? '0,0.0000' : '0.0000',
        };
      }
    }}
  />
));

export default ReportsFundsDetailedStatements;
