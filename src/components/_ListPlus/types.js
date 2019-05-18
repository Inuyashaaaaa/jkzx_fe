import { array, arrayOf, bool, func, number, object, shape, string } from 'prop-types';

export const ListPlus = {
  rowKey: string,
  dataSource: arrayOf(
    shape({
      title: string,
      loading: bool,
    })
  ),
  loading: bool,
  visible: bool,
  formData: object,
  createLoading: bool,
  selectedKeys: array,
  formItems: array,
  title: string,
  width: number,
  onRemove: func,
  onCreate: func,
  onSelect: func,
  getFormNode: func,
  onPopover: func,
  signle: bool, // 开启单选
};

export const TableHeader = {
  // @todo 继承 StandardForm formItems 的类型
  title: string,
  formItems: array,
  disableSelectAll: bool,
  disableCreate: bool,
  onCreate: func,
  onChange: func,
  onCancel: func,
  onSelect: func,
  onPopover: func,
  getFormNode: func,
  hideSelector: bool,
};
