import { BookName, InstrumentId, ReportName, ValuationDate } from '@/domains/commonSearchForm';

export const searchFormControls = markets => {
  return [ReportName(markets), ValuationDate, BookName, InstrumentId];
};
