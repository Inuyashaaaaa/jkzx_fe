import {
  ClientName,
  MasterAgreementId,
  BaseContract,
  AssetType,
  ReportName,
  ValuationDate,
} from '@/domains/SearchForm';

export const searchFormControls = markets => {
  return [
    ReportName(markets),
    ValuationDate,
    ClientName,
    MasterAgreementId,
    BaseContract,
    AssetType,
  ];
};
