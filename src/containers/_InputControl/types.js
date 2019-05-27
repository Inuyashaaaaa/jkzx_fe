import { any, func, string, arrayOf, shape } from 'prop-types';
import { ButtonPlus } from '../ButtonPlus/types';

export const InputControl = {
  onChange: func,
  onChangePlus: func,
  value: any,
  type: string,
  getFormControlRef: func,
  addonBeforeBtnItems: arrayOf(shape(ButtonPlus)),
  addonAfterBtnItems: arrayOf(shape(ButtonPlus)),
};
