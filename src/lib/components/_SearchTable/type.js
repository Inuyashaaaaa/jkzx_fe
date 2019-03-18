import { array, func, object, oneOfType, number, bool } from 'prop-types';

export const SearchTableBase = {
  columns: array,
  formItems: array,
  advancedFormItems: array,
  createBtn: object,
  removeBtn: object,
  node: func,
  title: func,
  edit: bool,
  dataSource: oneOfType([array, func]),
  pagination: oneOfType([object, bool]),
  chunkSize: number,
  labelCol: oneOfType([number, object]),
  wrapperCol: oneOfType([number, object]),
  onSelect: func,
  onBtnClick: func,
  onSearch: func,
  onTableChange: func,
  onEdit: func,
};

export const SearchTable = SearchTableBase;
