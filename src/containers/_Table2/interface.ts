// import 'ag-grid-enterprise';
import { Omit } from '@/containers/common/types';
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
import { IComputedInput } from '../_Form2';
import { AllInputProps } from '../_Form2/Input';

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
  total: number;
}

export interface TableBaseProps
  extends Omit<AgGridReactProps, 'onPaginationChanged' | 'pagination'> {
  theme?: 'balham' | 'balham-dark' | 'blue' | 'bootstrap' | 'dark' | 'fresh' | 'material';
  width?: number;
  height?: number;
  columnDefs?: IColumnDef[];
  rowKey: IRowKey;
  vertical?: boolean;
  autoSizeColumnsToFit?: boolean;
  loading?: boolean;
  darkIfDoNotEditable?: boolean;
  title?: string | React.ReactNode;
  getHorizontalrColumnDef?: IGetHorizontalrColumnDef;
  pagination?: ITablePagination;
  paginationProps?: ITablePaginationProps;
  onPaginationChange?: (page: number, pageSize?: number) => void;
  onPaginationShowSizeChange?: (current: number, size: number) => void;
  unionId?: string;
}

export interface TableState {
  columnDefs?: IColumnDef[];
}

export type IRowKey = string;

export type IColumnDef = IColDef | ColGroupDef;

export type IRowData = any[];

export interface TableGetContextMenuItemsParams extends GetContextMenuItemsParams {
  rowData: any;
}

export interface IColDef extends ColDef, IComputedInput {
  input?: AllInputProps | ((record: any) => AllInputProps);
  rowHeight?: number;
  columnDefs?: Array<Omit<IColDef, 'columnDefs'>>;
  vertical?: boolean;
  rules?: ValidationRule[];
  totalable?: boolean;
  calculateTotalData?: (preTotalData: number, rowRecord: object) => number;
  exsitable?: (params: { colDef: ColDef; data: object }) => boolean | boolean;
}

export type IInputCellRendererValue =
  | string
  | number
  | { value: string | number; toNumber: any; toString: any };

export interface IInputCellRendererParams extends ICellRendererParams {
  colDef: IColDef;
  value: IInputCellRendererValue;
}

export interface InputColumn extends Column {
  getColDef(): IColDef;
}

export interface IInputCellEditorParams extends ICellEditorParams {
  column: InputColumn;
}

export type IGetHorizontalrColumnDef = (rowData: any) => IColumnDef | void;
