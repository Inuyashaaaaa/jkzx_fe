import { FormPlus as FormPlusTypes } from '@/lib/components/_FormPlus/types';
import { TablePlus as TablePlusTypes } from '@/lib/components/_TablePlus/types';
import { array, bool, func, oneOfType, shape, string } from 'prop-types';

export const SearchTablePlus = {
  ...TablePlusTypes,
  form: shape({
    ...FormPlusTypes,
    onSearch: func,
    searchText: string,
    searchLoading: bool,
  }),
};

export const SearchTablePlusProxy = {
  ...SearchTablePlus,
  dataSource: oneOfType([array, func]),
  onFetchError: func,
};
