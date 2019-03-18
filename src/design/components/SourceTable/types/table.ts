import { ButtonProps } from 'antd/lib/button';
import React, { CSSProperties } from 'react';
import { Form2Props, IFormChangeHandle, IFormControl } from '../../../components/Form/types';
import {
  IColumnDef,
  ITableGetContextMenuItemsParams,
  ITablePagination,
  ITableRowData,
  TableProps,
} from '../../../components/Table/types';
import { Omit } from '../../common/types';
import { IInputType } from '../../Form/Input/interface';
import { IColDef } from '../../Table/types';
import { IRowActionProps, ISourceTableRowActionClickHandleParams } from './rendering';

export type ITableDataSource = ITableRowData;

// @todo total footer??
export interface IInputTypeColDef extends IColDef {
  inputType: IInputType;
}

export interface SourceTableGetContextMenuItemsParams extends ITableGetContextMenuItemsParams {
  searchFormData: {};
  tableDataSource: any[];
  tableFormData: {};
  pagination: {};
}

export interface SourceDisplayerProps {
  resetable?: boolean;
  resetButtonProps?: ButtonProps;
  resetLoading?: boolean;
  resetText?: string;
  onResetButtonClick?: (params: { searchFormData: any; domEvent: MouseEvent }) => void;
  searchText?: string;
  searchButtonProps?: ButtonProps;
  searchFormData?: object;
  searchable?: boolean;
  onSearchButtonClick?: (params: { searchFormData: any; domEvent?: MouseEvent }) => void;
  onSearchFormChange?: IFormChangeHandle;
  searchFormControls?: IFormControl[];
  searchFormProps?: Form2Props;
}

export interface SourceTableBaseProps extends TableProps, SourceDisplayerProps {
  dataSource?: any[];
  tableFormData?: object;
  dobuleAction?: boolean;
  style?: CSSProperties;
  tableFormControls?: IFormControl[];
  onTableFormChange?: IFormChangeHandle;
  editable?: boolean;
  columnDefs?: IColumnDef[];
  tableFormProps?: Form2Props;
  actionColDef?: IColumnDef;
  loading?: boolean;
  rowActions?:
    | Array<React.ReactElement<IRowActionProps<Promise<void>>>>
    | ((
        params: ISourceTableRowActionClickHandleParams
      ) => Array<React.ReactElement<IRowActionProps<Promise<void>>>>);
  action?: React.ReactNode;
  totalable?: boolean;
  totalColDef?: IColumnDef;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface ISourceTableTableActionProps<T = void> {
  onClick?: (event: MouseEvent) => T;
  loading?: boolean;
}

export interface SourceTableProps extends Omit<SourceTableBaseProps, 'rowActions'> {
  rowActions?:
    | Array<React.ReactElement<IRowActionProps<Promise<boolean | void>>>>
    | ((
        params: ISourceTableRowActionClickHandleParams
      ) => Array<React.ReactElement<IRowActionProps<Promise<boolean | void>>>>);
}

export interface SourceTableState {
  dataSource?: any[];
  searchFormData?: any;
  tableFormData?: any;
  createFormData?: any;
  columnDefs?: IColumnDef[];
  loading?: boolean;
  saveLoading?: boolean;
  resetLoading?: boolean;
  createModalVisible?: boolean;
  createModalConfirmLoading?: boolean;
  pagination?: ITablePagination;
}
