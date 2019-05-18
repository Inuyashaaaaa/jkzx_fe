import { arrayOf, string, number, func, bool, shape, array, oneOfType, object } from 'prop-types';

export const ListTableBase = {
  id: number,
  dataSource: arrayOf(
    shape({
      id: number,
      title: string,
      loading: bool,
    })
  ),
  loading: bool,
  visible: bool,
  formData: object,
  createLoading: bool,
  selectedIds: array,
  formItems: array,
  title: string,
  width: number,
  onRemove: func,
  onCreate: func,
  onSelect: func,
  getFormNode: func,
  onPopover: func,
};

export const ListTable = {
  ...ListTableBase,
  getNode: func,
  autoFetch: bool,
  dataSource: oneOfType([
    func,
    arrayOf(
      shape({
        id: number,
        title: string,
        loading: bool,
      })
    ),
  ]),
};

export const TableHeader = {
  title: string,
  // @todo 继承 StandardForm formItems 的类型
  formItems: array,
  disableSelectAll: bool,
  disableCreate: bool,
  onCreate: func,
  onChange: func,
  onCancel: func,
  onSelect: func,
  onPopover: func,
  getFormNode: func,
};
