import { array, bool, element, func, number, object, oneOfType, string } from 'prop-types';

export const StandardForm = {
  dataSource: object,
  items: array,
  // eslint-disable-next-line react/no-unused-prop-types
  onChange: func,
  getNode: func,
  chunkSize: number,
  labelCol: oneOfType([number, object]),
  wrapperCol: oneOfType([number, object]),
  width: oneOfType([number, string]),
  onSave: func,
  saveText: string,
  onCancel: func,
  cancelText: string,
  footer: oneOfType([element, bool]),
  confirmLoading: bool,
  strictUpdate: bool,
};
