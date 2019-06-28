import {
  ClientNameFund,
  MasterAgreementId,
  ReportName,
  ValuationDate,
} from '@/containers/searchForm';

export const searchFormControls = markets => {
  return [ReportName(markets), ValuationDate, ClientNameFund, MasterAgreementId];
};
