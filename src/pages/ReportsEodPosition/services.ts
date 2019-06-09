import {
  BookName,
  LegalName,
  InstrumentId,
  ProductType,
  ReportName,
  ValuationDate,
} from '@/containers/searchForm';

export const searchFormControls = markets => {
  return [ReportName(markets), ValuationDate, BookName, LegalName, InstrumentId, ProductType];
};
