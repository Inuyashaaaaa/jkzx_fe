import {
  BookName,
  LegalName,
  InstrumentId,
  ProductType,
  ReportName,
  ValuationDate,
} from '@/domains/commonSearchForm';

export const searchFormControls = markets => {
  return [ReportName(markets), ValuationDate, BookName, LegalName, InstrumentId, ProductType];
};
