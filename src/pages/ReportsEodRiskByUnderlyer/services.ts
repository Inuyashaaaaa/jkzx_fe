import { BookName, InstrumentId, ReportName, ValuationDate } from '@/domains/SearchForm';

export const searchFormControls = markets => {
  return [ReportName(markets), ValuationDate, BookName, InstrumentId];
};
