import { TooltipPlacement } from 'antd/lib/tooltip';
import { CSSProperties } from 'react';
import { ShowInputProps } from './subtypes/ShowInput/types';
import { StaticInputProps } from './subtypes/StaticInput/types';
import { Cascader2Props } from './types/Cascader/types';
import { Checkbox2Props } from './types/Checkbox/types';
import { DatePicker2Props } from './types/Date/types';
import { Email2Props } from './types/Email/types';
import { Input2Props } from './types/Input/types';
import { InputNumber2Props } from './types/InputNumber/types';
import { Select2Props } from './types/Select/types';
import { TextArea2Props } from './types/TextArea/types';
import { TimePicker2Props } from './types/Time/types';
import { Upload2Props } from './types/Upload/types';

export type IInputSize = 'large' | 'default' | 'small';

export type IInputSubtype = 'editing' | 'show' | 'static';

export type IInputType =
  | 'select'
  | 'input'
  | 'number'
  | 'date'
  | 'time'
  | 'checkbox'
  | 'textarea'
  | 'upload'
  | 'email'
  | 'cascader';

export type InputProps = InputProxyProps &
  InputPolymProps &
  (
    | ShowInputProps
    | StaticInputProps
    | Input2Props
    | InputNumber2Props
    | Cascader2Props
    | DatePicker2Props
    | TimePicker2Props
    | Select2Props
    | Checkbox2Props
    | TextArea2Props
    | Upload2Props
    | Email2Props
    | ShowInputProps
    | StaticInputProps);

interface InputCommonProps {
  /** input 的值 */
  value?: any;
  onChange?: (...params: any[]) => any;
}

export interface InputPolymProps extends InputCommonProps {
  /** 'editing' | 'show' | 'static' */
  subtype?: IInputSubtype;
  className?: string;
  formatValue?: (value: any) => string | React.ReactNode;
  parseValue?(value: any): any;
  onValueChange?(value: any): void;
  getValue?(...params: any[]): any;
  formatChangeEvent?(event: any): { origin: any; normal: any };
}

export interface InputProxyProps {
  /** 'select' | 'input' | 'number' | 'date' | 'time' | 'checkbox' | 'textarea' | 'upload' | 'email' | 'cascader' */
  type?: IInputType;
  loading?: boolean;
  status?: 'error' | 'warning' | 'success' | 'validating' | 'info';
  statusTip?: string;
  wrapperStyle?: CSSProperties;
  style?: CSSProperties;
  statusTipVisible?: boolean;
  /* 只保留 antd 原始组件，去除 loading, status wrapper */
  raw?: boolean;
  wrapperClassName?: string;
  onStatusTipMouseEnter?: (event: MouseEvent) => void;
  onStatusTipMouseLeave?: (event: MouseEvent) => void;
  statusTipPlacement?: TooltipPlacement;
  after?: React.ReactElement;
  before?: React.ReactElement;
}
