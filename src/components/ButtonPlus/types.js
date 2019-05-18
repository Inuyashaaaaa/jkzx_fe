import { FormControl as FormControlTypes } from '@/components/_InputControl/types';
import { arrayOf, bool, element, func, object, oneOf, oneOfType, shape, string } from 'prop-types';

export const ButtonPlus = {
  name: oneOfType([string, element]).isRequired,
  type: string,
  icon: string,
  size: string,
  block: string,
  onClick: func,
  loading: oneOfType([bool, object]),
  dropMenu: arrayOf(object), // object type is Button props
  addonBeforeFormControl: shape(FormControlTypes),
  addonAfterFormControl: shape(FormControlTypes),
  popover: shape({
    type: oneOf(['popover', 'toolTip', 'popconfirm', 'popModal']),
  }),
};
