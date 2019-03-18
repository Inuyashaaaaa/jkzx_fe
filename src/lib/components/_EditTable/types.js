import { array, arrayOf, func, oneOf, oneOfType, string } from 'prop-types';

export const EditTableBase = {
  columns: array,
  onChange: func,
  /**
   * {
   *   action: 'add' | 'remove' | 'moveup' | 'movedown' | 'copy' | 'change';
   *   dataSource: array;
   *   value: object;
   * } => void
   */
  onEdit: func,
  dataSource: array,
  rowKey: oneOfType([string, func]),
  actions: arrayOf(oneOf(['copy', 'up', 'down', 'create', 'remove'])),
};
