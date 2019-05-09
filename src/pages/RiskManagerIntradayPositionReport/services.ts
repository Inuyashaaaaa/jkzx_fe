import { BookName, LegalName, InstrumentId, ProductType } from '@/domains/SearchForm';

export const searchFormControls = () => {
  return [BookName, LegalName, InstrumentId, ProductType];
};
