import { any, arrayOf, bool, shape, string } from 'prop-types';

export const CheckboxPlus = {
  items: arrayOf(
    shape({
      label: string,
      value: any,
      disabled: bool,
    })
  ),
};
