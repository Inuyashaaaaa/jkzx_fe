import { ButtonProps } from 'antd/lib/button';
import { FormItemProps } from 'antd/lib/form';
import { FormComponentProps, FormProps, WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, TableProps } from 'antd/lib/table';
import React, { CSSProperties } from 'react';
import { Omit } from './common/types';
import FormSwitchCell from './Form2/cells/SwitchCell';
import FormBase from './Form2/FormBase';
import InputManager from './Input/register';
import TableManager from './Table2/api';
import TableSwitchCell from './Table2/cells/SwitchCell';

export interface IColDef {
  dataIndex?: string;
  render?: any;
}

export interface IRenderOptions<T = any> {
  form?: WrappedFormUtils;
  editing?: boolean;
}

export interface IFormColDef<T = any> extends IColDef {
  render?: (value: any, record: T, index: number, params: IRenderOptions) => React.ReactElement;
  /* 作用和 field 中的 label 一样，方便直接使用 table.columns 的数据 */
  title?: string;
  editable?: boolean;
  getValue?:
    | ((record: T, params: IFormTriggerCellValueChangedParams) => any)
    | ([(record: T, params: IFormTriggerCellValueChangedParams) => any, ...string[]]);
}

export interface ITableColDef<T = any> extends IColDef, Omit<ColumnProps<T>, 'render'> {
  // totalable?: boolean | ((params: { totalData: number; record: object }) => number);
  title?: string;
  editable?: boolean;
  render?: (value: any, record: T, index: number, params: IRenderOptions) => React.ReactElement;
  getValue?:
    | ((record: T, params: ITableTriggerCellValueChangedParams) => any)
    | ([(record: T, params: ITableTriggerCellValueChangedParams) => any, ...string[]]);
}

export interface IFormCellProps<T = any> {
  colDef: IFormColDef<T>;
  record: T;
  api: FormBase;
  cellApi?: FormSwitchCell;
  form?: WrappedFormUtils;
  getValue?: {
    depends: string[];
    value: (record: T, params: IFormTriggerCellValueChangedParams) => any;
  };
}

export interface ITableCellProps<T = any> {
  colDef: ITableColDef<T>;
  record: T;
  rowIndex: number;
  api: ITableApi;
  context: ITableContext;
  getRowKey: () => string;
  className?: string;
  style?: CSSRuleList;
  $$render?: (value: any, record: T, index: number, params: IRenderOptions) => React.ReactNode;
  getValue?: {
    depends: string[];
    value: (record: T, params: ITableTriggerCellValueChangedParams) => any;
  };
  cellApi?: TableSwitchCell;
  form?: WrappedFormUtils;
}

export interface ITableRowProps<T = any> extends FormComponentProps {
  record: T;
  rowIndex: number;
  api: ITableApi;
  context: ITableContext;
  getRowKey: () => string;
}

export interface ITableTriggerCellValueChangedParams<T = any> {
  record: T;
  rowIndex: number;
  dataIndex: string;
  oldValue: any;
  rowId?: string;
  linkage?: boolean;
}

export interface ITableTriggerCellValueChangeParams<T = any> {
  record?: T;
  rowIndex?: number;
  value?: any;
  changedValues?: any;
  allValues?: any;
  rowId?: string;
}

export interface IFormTriggerCellValueChangeParams<T = any> {
  record?: T;
  value?: any;
  changedValues?: any;
  allValues?: any;
}

export interface IFormTriggerCellValueChangedParams<T = any> {
  record: T;
  dataIndex: string;
  oldValue: any;
  linkage?: boolean;
  value: any;
}

export interface ITableProps<T = any> extends Omit<TableProps<T>, 'columns'> {
  onCellValueChanged?: (params: ITableTriggerCellValueChangedParams) => void;
  onCellValueChange?: (params: ITableTriggerCellValueChangeParams) => void;
  columns?: ITableColDef[];
  inputManager?: InputManager;
  vertical?: boolean;
}

export type ITableContext = any;

export interface ITableApi {
  tableManager: TableManager;
  inputManager: InputManager;
  eventBus: any;
}

export interface IFormBaseProps<T = any> extends FormProps {
  onValueChanged?: IFormValueChangedHandle<T>;
  onValueChange?: IFormValueChangeHandle<T>;
  inputManager?: InputManager;
  actionFieldProps?: FormItemProps;
  submitable?: boolean;
  resetable?: boolean;
  submitText?: string;
  className?: string;
  style?: CSSProperties;
  columnNumberOneRow?: number;
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

export interface IFormProps<T = any> extends IFormBaseProps {
  eventBus?: any;
}

export type IFormValueChangedHandle<T = any> = (params: IFormTriggerCellValueChangedParams) => void;

export type IFormValueChangeHandle<T = any> = (params: IFormTriggerCellValueChangeParams) => void;

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
