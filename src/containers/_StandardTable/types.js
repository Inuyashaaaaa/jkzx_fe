import {
  oneOfType,
  oneOf,
  array,
  func,
  bool,
  element,
  string,
  object,
  shape,
  arrayOf,
} from 'prop-types';

export const StandardTableBase = {
  selectedRowKeys: array,
  selectedColumnKeys: array,
  section: oneOfType([
    element,
    arrayOf(
      shape({
        batch: oneOfType([bool, oneOf(['signle', 'multi'])]),
      })
    ),
  ]),
  extra: oneOfType([
    element,
    arrayOf(
      shape({
        batch: oneOfType([bool, oneOf(['signle', 'multi'])]),
      })
    ),
  ]),
  toes: oneOfType([
    element,
    arrayOf(
      shape({
        batch: oneOfType([bool, oneOf(['signle', 'multi'])]),
      })
    ),
  ]), // not yet complete
  edit: oneOfType([array, bool]),
  loading: bool,
  onBtnClick: func,
  bordered: bool,
  rowKey: oneOfType([string, func]),
  pagination: oneOfType([object, bool]),
  dataSource: array,
  columns: array, // needTotal
  showTotal: oneOfType([string, bool]),
};

export const StandardTable = {
  ...StandardTableBase,
  selectedRowKeys: oneOfType([array, bool]),
  selectedColumnKeys: oneOfType([array, bool]),
  getTableNode: func,
  autoFetch: bool,
  dataSource: oneOfType([array, func]),
};
