import { ButtonProps } from 'antd/lib/button';
import { ColProps } from 'antd/lib/col';
import { FormItemProps } from 'antd/lib/form';
import { FormProps, GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { CSSProperties } from 'react';
import { InputProps } from './Input/interface';

export type IColSpace = ColProps | number;

export interface IControlProps extends FormItemProps {}

export interface IFormControl {
  field: string;
  decorator?: GetFieldDecoratorOptions;
  control?: IControlProps;
  input?: InputProps;
}

export interface Form2BaseProps extends FormProps {
  actionControlProps?: IControlProps;
  submitable?: boolean;
  resetable?: boolean;
  submitText?: string;
  className?: string;
  style?: CSSProperties;
  controlNumberOneRow?: number;
  dataSource?: object;
  controls?: IFormControl[];
  footer?: boolean | JSX.Element;
  submitLoading?: boolean;
  saveText?: string;
  resetLoading?: boolean;
  resetText?: string;
  fields?: any[];
  /* 当 layout 非 inline 时，作用到每一行 */
  rowProps?: (params: { index: number }) => any;
  /* 当 layout 非 inline 时，作用到每一列 */
  colProps?: (params: { rowIndex: number; index: number }) => any;
  ref?: (node: any) => void;
  wrappedComponentRef?: (node: any) => void;
  onValueChange?: (params: IFormChangeParams) => void;
  onFieldChange?: (params: { fields: any }) => void;
  onSubmitButtonClick?: (params: { dataSource: any; domEvent: MouseEvent }) => void;
  onResetButtonClick?: (params: { dataSource: any; domEvent: MouseEvent }) => void;
  submitButtonProps?: ButtonProps;
  resetButtonProps?: ButtonProps;
}

export interface Form2Props extends Form2BaseProps {
  onValueChange?: IFormChangeHandle;
}

export interface FormState {
  dataSource?: any[];
  fields?: any;
}

export interface IFormChangeParams {
  values: any;
  changedValues: any;
}

export type IFormChangeHandle = (params: IFormChangeParams & { oldValues: any }) => void;
