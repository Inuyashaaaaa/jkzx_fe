import { ClientNameFund, MasterAgreementId, ReportName, ValuationDate } from '@/domains/SearchForm';

export const searchFormControls = markets => {
  return [ReportName(markets), ValuationDate, ClientNameFund, MasterAgreementId];
};
