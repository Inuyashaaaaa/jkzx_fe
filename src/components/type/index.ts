import { ButtonProps } from 'antd/lib/button';
import { FormItemProps } from 'antd/lib/form';
import {
  FormComponentProps,
  FormProps,
  GetFieldDecoratorOptions,
  WrappedFormUtils,
} from 'antd/lib/form/Form';
import { ColumnProps, TableProps } from 'antd/lib/table';
import React, { CSSProperties } from 'react';
import FormSwitchCell from '../Form2/cells/SwitchCell';
import FormBase from '../Form2/FormBase';
import Table2 from '../Table2';
import TableManager from '../Table2/api';
import TableSwitchCell from '../Table2/cells/SwitchCell';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IFormField {
  type: 'field';
  value?: any;
  name?: string;
  touched?: boolean;
  dirty?: boolean;
  errors?: string[];
  validating?: boolean;
}

export interface IFormSection {
  type: 'section';
}

export interface IFormData {
  [key: string]: IFormField | IFormSection | any;
}

export interface ITableData {
  [key: string]: IFormField | any;
}

export interface IColDef<T> {
  title?: any;
  dataIndex?: string;
  render?: (
    value: any,
    record: T,
    index: number,
    params: IRenderOptions<IColDef<T>>,
  ) => React.ReactNode;
}

export interface IRenderOptions<C = any, A = any> {
  form?: Omit<WrappedFormUtils, 'getFieldDecorator'> & {
    getFieldDecorator<T extends object>(
      id: keyof T,
      options?: GetFieldDecoratorOptions,
    ): (node: React.ReactNode) => React.ReactNode;
    getFieldDecorator(
      options?: GetFieldDecoratorOptions,
    ): (node: React.ReactNode) => React.ReactNode;
  };
  editing?: boolean;
  colDef?: C;
  api?: ITableApi;
  cellApi?: A;
  context?: ITableContext;
  tableApi?: Table2;
}

export interface IFormColDef<T = any> extends IColDef<T> {
  /* 作用和 field 中的 label 一样，方便直接使用 table.columns 的数据 */
  title?: React.ReactNode;
  editable?: boolean;
  defaultEditing?: boolean;
  editing?: boolean;
  render?: (
    value: any,
    record: T,
    index: number,
    params: IRenderOptions<IFormColDef<T>, FormSwitchCell>,
  ) => React.ReactNode;
}

export interface ITableColDef<T = any>
  extends IColDef<T>,
    Omit<ColumnProps<T>, 'render' | 'onCell'> {
  // totalable?: boolean | ((params: { totalData: number; record: object }) => number);
  title?: React.ReactNode;
  defaultEditing?:
    | boolean
    | ((
        record: T,
        index: number,
        params: {
          colDef: ITableColDef<T>;
        },
      ) => boolean);
  editing?:
    | boolean
    | ((
        record: T,
        index: number,
        params: {
          colDef: ITableColDef<T>;
        },
      ) => boolean);
  editable?:
    | boolean
    | ((
        record: T,
        index: number,
        params: {
          colDef: ITableColDef<T>;
        },
      ) => boolean);
  onCell?: (
    record: T,
    index: number,
    params: {
      colDef: ITableColDef<T>;
    },
  ) => any;
  render?: (
    value: any,
    record: T,
    index: number,
    params: IRenderOptions<ITableColDef<T>, TableSwitchCell>,
  ) => React.ReactNode;
}

export interface IFormCellProps<T = IFormData> {
  prefix?: string;
  colDef: IFormColDef<T>;
  record: T;
  api: FormBase;
  cellApi?: FormSwitchCell;
  form?: WrappedFormUtils;
}

export interface ITableContextMenuParams<T = ITableData> {
  record: T;
  rowIndex: number;
  api: ITableApi;
  context: ITableContext;
  getRowKey: () => string;
  columns: ITableColDef[];
  rowId: string;
}

export interface ITableCellProps<T = ITableData> {
  colDef: ITableColDef<T>;
  record: T;
  rowId: string;
  rowIndex: number;
  api: ITableApi;
  tableApi: Table2;
  cellApi?: TableSwitchCell;
  context: ITableContext;
  getRowKey: () => string;
  className?: string;
  style?: CSSProperties;
  $$render?: (value: any, record: T, index: number, params: IRenderOptions) => React.ReactNode;
  form?: WrappedFormUtils;
  vertical?: boolean;
}

export interface ITableRowProps<T = any> extends FormComponentProps {
  record: T;
  rowIndex: number;
  api: ITableApi;
  context: ITableContext;
  getRowKey: () => string;
  columns: ITableColDef[];
  rowId: string;
  getEditing: () => boolean;
  setEditing: (editing: boolean) => void;
  getContextMenu?: (
    params: ITableContextMenuParams,
  ) => React.ReactNode | (() => React.ReactNode) | boolean;
}

export interface ITableTriggerCellEditingChangedParams<T = any> {
  record: T;
  rowIndex: number;
  dataIndex: string;
  rowId?: string;
}

export interface ITableTriggerCellValueChangeParams<T = any> {
  record?: T;
  rowIndex?: number;
  value?: any;
  changedValues?: any;
  allValues?: any;
  rowId?: string;
}

export interface ITableTriggerCellFieldsChangeParams<T = any> {
  record?: T;
  rowIndex?: number;
  value?: any;
  rowId?: string;
  changedFields?: any;
  allFields?: any;
}

export interface IFormTriggerCellValueChangeParams<T = any> {
  record?: T;
  value?: any;
  changedValues?: any;
  allValues?: any;
}

export interface IFormTriggerCellEditingChangedParams<T = any> {
  record: T;
  dataIndex: string;
  oldValue: any;
  linkage?: boolean;
  value: any;
}

export interface ITableProps<T = ITableData> extends Omit<TableProps<T>, 'columns' | 'dataSource'> {
  onCellEditingChanged?: (params: ITableTriggerCellEditingChangedParams) => void;
  onCellValuesChange?: (params: ITableTriggerCellValueChangeParams) => void;
  onCellFieldsChange?: (params: ITableTriggerCellFieldsChangeParams) => void;
  getContextMenu?: (
    params: ITableContextMenuParams,
  ) => React.ReactNode | (() => React.ReactNode) | boolean;
  columns?: ITableColDef[];
  vertical?: boolean;
  dataSource?: ITableData[];
}

export type ITableContext = any;

export interface ITableApi {
  tableManager: TableManager;
  eventBus: any;
  tableApi: Table2;
}

export interface IFormBaseProps<T = IFormData> extends FormProps {
  onEditingChanged?: IFormEditingChangedHandle<T>;
  onValuesChange?: IFormValuesChangeHandle<T>;
  actionFieldProps?: FormItemProps;
  submitable?: boolean;
  resetable?: boolean;
  submitText?: string;
  className?: string;
  style?: CSSProperties;
  columnNumberOneRow?: number;
  dataSource?: T;
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
  onSubmitButtonClick?: (params: { dataSource: IFormData; domEvent: MouseEvent }) => void;
  onResetButtonClick?: (params: { dataSource: IFormData; domEvent: MouseEvent }) => void;
  submitButtonProps?: ButtonProps;
  resetButtonProps?: ButtonProps;
  eventBus?: any;
}

export interface IFormProps<T = any> extends IFormBaseProps {
  eventBus?: any;
}

export type IFormEditingChangedHandle<T = any> = (
  params: IFormTriggerCellEditingChangedParams,
) => void;

export type IFormValuesChangeHandle<T = any> = (
  props: T,
  changedValues: any,
  allValues: any,
) => void;

export interface IInputBaseProps {
  autoSelect?: boolean;
  value?: any;
  onChange?: (...args: any[]) => any;
  onValueChange?: (...args: any[]) => any;
  editing?: boolean;
}

export abstract class InputBase<P = any, S = any> extends React.PureComponent<
  P & IInputBaseProps,
  S
> {
  public abstract renderEditing(): any;

  public abstract renderRendering(): any;

  public render() {
    if (this.props.editing === undefined ? true : this.props.editing) {
      return this.renderEditing();
    }
    return this.renderRendering();
  }
}
