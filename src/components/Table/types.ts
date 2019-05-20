// import 'ag-grid-enterprise';
import {
  ColDef,
  ColGroupDef,
  Column,
  GetContextMenuItemsParams,
  ICellEditorParams,
  ICellRendererParams,
} from 'ag-grid-community';
import { AgGridReactProps } from 'ag-grid-react';
import { ValidationRule } from 'antd/lib/form';
import { PaginationProps } from 'antd/lib/pagination';
import React from 'react';
import { Omit } from '../common/types';
import { InputProps } from '../Form/Input/interface';
import {
  ILinkageMetaExsitable,
  ILinkageMetaGetValue,
  ILinkageMetaInput,
  ILinkageMetaRules,
} from './normalize';

export interface TableExtendPaginationProps extends PaginationProps {
  backend?: boolean;
}

export type ITablePaginationProps = Omit<
  TableExtendPaginationProps,
  'onChange' | 'onShowSizeChange' | 'current' | 'pageSize' | 'total'
>;

export interface ITablePagination {
  current: number;
  pageSize: number;
  total?: number;
}

export interface TableBaseProps
  extends Omit<AgGridReactProps, 'onPaginationChanged' | 'pagination'> {
  theme?: 'balham' | 'balham-dark' | 'blue' | 'bootstrap' | 'dark' | 'fresh' | 'material';
  width?: number;
  height?: number;
  columnDefs?: IColumnDef[];
  rowKey: ITableRowKey;
  vertical?: boolean;
  autoSizeColumnsToFit?: boolean;
  loading?: boolean;
  darkIfDoNotEditable?: boolean;
  title?: string | React.ReactNode;
  getHorizontalrColumnDef?: IGetHorizontalrColumnDef;
  pagination?: boolean | ITablePagination;
  paginationProps?: ITablePaginationProps;
  onPaginationChange?: (params: { pagination: ITablePagination }) => void;
  onPaginationShowSizeChange?: (params: { pagination: ITablePagination }) => void;
  /* 表格实例的唯一标示，热力图需要传递 */
  unionId?: string;
}

export interface TableProps extends TableBaseProps {}

export interface TableState {
  pagination: ITablePagination;
}

export type ITableRowKey = string;

export type ITableRowData = any[];

export type IColumnDef = IColDef | ColGroupDef;

export interface ITableGetContextMenuItemsParams extends GetContextMenuItemsParams {
  rowData: any;
}

export type ITableInput = InputProps & {
  prompt?: string;
};

export type ILinkageRules =
  | ValidationRule[]
  | ((record: any) => ValidationRule[])
  | ((record: any) => ILinkageMetaRules);

export type ILinkageInput =
  | ITableInput
  | ((record: any) => ITableInput)
  | ((record: any) => ILinkageMetaInput);

export type ILinkageExsitable =
  | boolean
  | ((params: { colDef: ColDef; data: object }) => boolean)
  | ((params: { colDef: ColDef; data: object }) => ILinkageMetaExsitable);

export type ILinkageGetValue =
  | ILinkageMetaGetValue
  | ((params: { colDef: ColDef; data: object }) => ILinkageMetaGetValue);

export interface ILinkageMeta<T> {
  value: T;
  depends: string[];
}

export interface IColDef extends ColDef {
  render?: (params: ICellRendererParams) => any;
  input?: ILinkageInput;
  exsitable?: ILinkageExsitable;
  rules?: ILinkageRules;
  getValue?: ILinkageGetValue;
  columnDefs?: Array<Omit<IColDef, 'columnDefs'>>;
  totalable?: boolean;
  calculateTotalData?: (params: { totalData: number; record: object }) => number;
}

export type IInputCellRendererValue =
  | string
  | number
  | { value: string | number; toNumber: any; toString: any };

export interface IInputCellRendererParams extends ICellRendererParams {
  colDef: IColDef;
  value: IInputCellRendererValue;
}

export interface IInputColumn extends Column {
  getColDef(): IColDef;
}

export interface IInputCellEditorParams extends ICellEditorParams {
  column: IInputColumn;
}

export type IGetHorizontalrColumnDef = (params: { rowData: any }) => IColumnDef | void;
