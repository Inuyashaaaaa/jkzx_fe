import { arrayOf, string, objectOf, func, shape, array, oneOfType, object } from 'prop-types';
import { ListTable } from '@/containers/_ListTable/types';

export const BigCascaderBase = {
  material: oneOfType([arrayOf(shape(ListTable))]),
  onRemove: func,
  onCreate: func,
  onChange: func,
  getNode: func, // {item, node}
  value: objectOf(array),
  // @todo
  commonFormItems: arrayOf(object),
  prefixCls: string,
};

export const BigCascader = {
  ...BigCascaderBase,
  material: oneOfType([arrayOf(shape(ListTable)), func]),
};
