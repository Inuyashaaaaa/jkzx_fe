import { array, bool, func, number, object, oneOf, oneOfType, string } from 'prop-types';

export const ButtonGroup = {
  text: bool,
  items: array.isRequired,
  onClick: func,
  justify: oneOf(['start', 'center', 'end']),
  align: oneOf(['top', 'middle', 'bottom']),
  style: object,
  gutter: oneOfType([number, object]),
  size: string,
};
