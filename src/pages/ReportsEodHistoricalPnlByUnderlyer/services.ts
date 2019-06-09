import { BookName, InstrumentId, ReportName, ValuationDate } from '@/containers/searchForm';

export const searchFormControls = markets => {
  return [ReportName(markets), ValuationDate, BookName, InstrumentId];
};
