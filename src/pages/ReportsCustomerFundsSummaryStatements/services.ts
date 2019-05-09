import {
  ClientNameFund,
  MasterAgreementId,
  ReportName,
  ValuationDate,
} from '@/domains/commonSearchForm';

export const searchFormControls = markets => {
  return [ReportName(markets), ValuationDate, ClientNameFund, MasterAgreementId];
};
