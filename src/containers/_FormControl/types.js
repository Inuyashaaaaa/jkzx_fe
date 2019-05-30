import { InputControl } from '@/containers/_InputControl/types';
import { any, array, bool, func, object, oneOfType, shape, string } from 'prop-types';

export const FormControl = {
  formData: object,
  field: shape(InputControl),
  strictUpdate: bool,
  countValue: oneOfType([func, array]),
  dataIndex: string.isRequired,
  value: any,
  onChange: func,
};
