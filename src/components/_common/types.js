import { any, bool, func, string } from '@/components/_common/node_modules/prop-types';

export const FormControl = {
  value: any,
  onChange: func,
  size: string,
  placeholder: string,
  bordered: bool,
  interactive: bool,
  hideEditIcon: bool,
  onEditIconClick: func,
  getFormControlRef: func,
  onPressEnter: func,

  // instance.focus: func,
  // instance.blur: func,

  // rule out follows
  //  formData
  //  strictUpdate
  //  countValue
  //  dataIndex
};
