import {
  ClientName,
  MasterAgreementId,
  InstrumentId,
  AssetType,
  ReportName,
  ValuationDate,
} from '@/domains/commonSearchForm';

export const searchFormControls = markets => {
  return [
    ReportName(markets),
    ValuationDate,
    ClientName,
    MasterAgreementId,
    InstrumentId,
    AssetType,
  ];
};
