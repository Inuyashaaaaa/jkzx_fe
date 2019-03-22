import { ButtonProps } from 'antd/lib/button';
import { FormItemProps } from 'antd/lib/form';
import { FormComponentProps, FormProps, GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { ColumnProps, TableProps } from 'antd/lib/table';
import React, { ComponentClass, CSSProperties } from 'react';
import { Omit } from './common/types';
import InputManager from './Input/register';
import { ILinkageExsitable } from './Table/types';
import TableManager from './Table2/api';

export interface IColDef {
  dataIndex: string;
  field?: any;
  decorator?: any;
  input?: any;
}

export interface IFormColDef<IInput = any> extends IColDef {
  dataIndex: string;
  field?: FormItemProps;
  decorator?: GetFieldDecoratorOptions;
  input?: IInput;
  render?: (value: any, record: any) => React.ReactNode;
  /* 作用和 field 中的 label 一样，方便直接使用 table.columns 的数据 */
  title?: string;
}

export interface ITableColDef<IInput = any, T = any> extends IColDef, ColumnProps<T> {
  dataIndex: string;
  field?: Omit<FormItemProps, 'label' | 'labelCol' | 'wrapperCol' | 'extra' | 'colon'>;
  decorator?: GetFieldDecoratorOptions;
  input?: IInput;
  totalable?: boolean | ((params: { totalData: number; record: object }) => number);
  exsitable?: ILinkageExsitable;
  editable?: boolean;
}

export interface ITableCellProps<T = any> {
  colDef: ITableColDef<T>;
  record: T;
  rowIndex: number;
  api: ITableApi;
  context: ITableContext;
  getRowKey: () => string;
}

export interface ITableRowProps<T = any> extends FormComponentProps {
  record: T;
  rowIndex: number;
  api: ITableApi;
  context: ITableContext;
  getRowKey: () => string;
}

export interface ITableTriggerCellValueChangedParams<T = any> {
  eventName: string;
  record: T;
  rowIndex: number;
  dataIndex: string;
  oldValue: any;
}

export interface ITableProps<T = any> extends TableProps<T> {
  onCellValueChanged?: (
    params: {
      record: T;
      rowIndex: number;
      dataIndex: string;
      value: any;
      oldValue: any;
    }
  ) => void;
  columns?: ITableColDef[];
  inputManager?: InputManager;
}

export type ITableContext = any;

export interface ITableApi {
  tableManager: TableManager;
  inputManager: InputManager;
  eventBus: any;
}

export interface IFormProps extends FormProps {
  inputManager?: InputManager;
  actionFieldProps?: FormItemProps;
  submitable?: boolean;
  resetable?: boolean;
  submitText?: string;
  className?: string;
  style?: CSSProperties;
  fieldNumberOneRow?: number;
  dataSource?: object;
  columns?: IFormColDef[];
  footer?: boolean | JSX.Element;
  submitLoading?: boolean;
  saveText?: string;
  resetLoading?: boolean;
  resetText?: string;
  /* 当 layout 非 inline 时，作用到每一行 */
  rowProps?: (params: { index: number }) => any;
  /* 当 layout 非 inline 时，作用到每一列 */
  colProps?: (params: { rowIndex: number; index: number }) => any;
  ref?: (node: any) => void;
  wrappedComponentRef?: (node: any) => void;
  onSubmitButtonClick?: (params: { dataSource: any; domEvent: MouseEvent }) => void;
  onResetButtonClick?: (params: { dataSource: any; domEvent: MouseEvent }) => void;
  submitButtonProps?: ButtonProps;
  resetButtonProps?: ButtonProps;
}

export type IWrappedForm = ComponentClass<IFormProps>;

export abstract class InputBase<P = any, S = any> extends React.PureComponent<
  P & {
    autoSelect?: boolean;
    value?: any;
    onChange?: (...args: any[]) => any;
    onValueChange?: (...args: any[]) => any;
    status: 'editing' | 'rendering';
  },
  S
> {
  public abstract renderEditing(): any;
  public abstract renderRendering(): any;

  public render() {
    if (this.props.status === 'rendering') {
      return this.renderRendering();
    }
    if (this.props.status === 'editing') {
      return this.renderEditing();
    }
    throw new Error(`InputBase: status(${this.props.status}) is must be exsit.`);
  }
}
