import {
  ClientName,
  MasterAgreementId,
  BaseContract,
  AssetType,
  ReportName,
  ValuationDate,
} from '@/containers/searchForm';

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
