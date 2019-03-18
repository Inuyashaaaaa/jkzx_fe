import Cascader2 from './types/Cascader';
import Checkbox2 from './types/Checkbox';
import DatePicker2 from './types/Date';
import Email2 from './types/Email';
import Input2 from './types/Input';
import InputNumber2 from './types/InputNumber';
import Select2 from './types/Select';
import TextArea2 from './types/TextArea';
import TimePicker2 from './types/Time';
import Upload2 from './types/Upload';

export const STATUS_ICON_MAP = {
  error: 'close-circle',
  success: 'check-circle',
  warning: 'warning',
  validating: 'loading',
  info: 'info-circle',
};

export const INPUT_COM_MAP = {
  input: Input2,
  select: Select2,
  number: InputNumber2,
  date: DatePicker2,
  time: TimePicker2,
  checkbox: Checkbox2,
  textarea: TextArea2,
  upload: Upload2,
  email: Email2,
  cascader: Cascader2,
};
