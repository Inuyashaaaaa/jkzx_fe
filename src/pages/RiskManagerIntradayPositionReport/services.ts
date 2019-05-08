import { BookName, LegalName, InstrumentId, ProductType } from '@/domains/commonSearchForm';

export const searchFormControls = () => {
  return [BookName, LegalName, InstrumentId, ProductType];
};
