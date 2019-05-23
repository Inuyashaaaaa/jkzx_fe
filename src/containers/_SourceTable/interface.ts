import { Form2StateProps, IFormControl } from '@/containers/_Form2';
import {
  IColumnDef,
  ITablePagination,
  ITablePaginationProps,
  TableGetContextMenuItemsParams,
  TableProps,
} from '@/containers/_Table2';
import { Omit } from '@/containers/common/types';
import { ButtonProps } from 'antd/lib/button';
import { ModalProps } from 'antd/lib/modal';
import { PaginationProps } from 'antd/lib/pagination';
import React, { CSSProperties } from 'react';
import { InputType } from '../_Form2/Input';
import { IModalButtonOnSwitchModal } from '../_ModalButton2';
import { IColDef } from '../_Table2';
import {
  ActionCellRendererClassParams,
  IRowActionProps,
} from './rendering/ActionCellRendererClass';

export type ITableDataSource = any[];

// @todo total footer
export interface IInputTypeColDef extends IColDef {
  inputType: InputType;
}

export interface IExtraActionEvent extends Event {
  tableDataSource: any[];
  tableFormData: any;
}

export type IExtraActionButtonOnClick = (event: IExtraActionEvent) => void;

export interface IExtraActionProps {
  onClick?: IExtraActionButtonOnClick;
}

export interface SourceTableGetContextMenuItemsParams extends TableGetContextMenuItemsParams {
  searchFormData: {};
  tableDataSource: any[];
  tableFormData: {};
  pagination: {};
}

export interface ITableFormEvent {
  formData: {};
  changed: {};
  oldFormData?: {};
  searchFormData: {};
  tableFormData?: {};
  tableDataSource: any[];
}

export type IStateRowActionButtonOnClick = (
  event: TableRowEventData & {
    state: SourceTableState;
  }
) => void;

export interface IStateRowActionProps {
  onClick?: IStateRowActionButtonOnClick;
  loading?: boolean;
}

export type IStateTableRowActions = Array<React.ReactElement<IStateRowActionProps>>;

export type IStateRowActions = Array<React.ReactElement<IStateTableRowActions>>;

export type IRowActions = Array<React.ReactElement<IRowActionProps>>;

export type ISourceTableBaseRowActions = IRowActions | ((event: TableRowEventData) => IRowActions);

export type ISourceTableBasePagination = boolean | ITablePagination;

export interface SourceTableBaseProps {
  /* 是否在底部也显示操作栏 */
  dobuleAction?: boolean;
  pagination?: ISourceTableBasePagination;
  paginationProps?: ITablePaginationProps;
  onPaginationChange?: (page: number, pageSize?: number) => void;
  onPaginationShowSizeChange?: (current: number, size: number) => void;
  resetLoading?: boolean;
  rowKey: string;
  onReset?: (
    event: {
      searchFormData: object;
      tableDataSource: any[];
      tableFormData: object;
    }
  ) => void;
  resetButtonProps?: ButtonProps;
  style?: CSSProperties;
  tableFormControls?: IFormControl[];
  onTableFormChange?: (event: ITableFormEvent) => void;
  searchText?: string;
  searchButtonProps?: ButtonProps;
  onSearch?: (
    event: {
      searchFormData: object;
      tableDataSource: any[];
      tableFormData: object;
    }
  ) => void;
  searchFormData?: object;
  dataSource?: any[];
  tableFormData?: object;
  saveText?: string;
  saveDisabled?: boolean;
  saveButtonProps?: ButtonProps;
  onSave?: (
    event: {
      searchFormData: object;
      tableDataSource: any[];
      tableFormData: {};
    }
  ) => void;
  createFormControls?: IFormControl[];
  createFormData?: object;
  onCreate?: (modalFormData?: object) => void | boolean | Promise<void | boolean | object>;
  createFormProps?: Form2StateProps;
  onSearchFormChange?: (event: ITableFormEvent) => void;
  searchFormProps?: Form2StateProps;
  searchFormControls?: IFormControl[];
  searchable?: boolean;
  editable?: boolean;
  tableColumnDefs?: IColumnDef[];
  createable?: boolean;
  createButton?: React.ReactNode;
  createModalContent?: React.ReactNode;
  tableProps?: Omit<TableProps, 'rowKey'>;
  removeable?: boolean;
  createText?: string;
  createModalProps?: ModalProps;
  onSwitchCreateModal?: IModalButtonOnSwitchModal;
  resetable?: false;
  tableFormProps?: Form2StateProps;
  insertable?: boolean;
  actionColDef?: IColumnDef;
  loading?: boolean;
  onCreateFormChange?: (
    values: object,
    tableData: any[],
    tableFormData: object,
    changed: {}
  ) => void;
  saveLoading?: boolean;
  resetText?: string;
  onInsert?: (
    event: {
      rowId: string;
      rowData: any;
      rowIndex: number;
      originEvent: Event;
    }
  ) => void;
  onRemove?: (
    event: {
      rowId: string;
      rowData: any;
      rowIndex: number;
      originEvent: Event;
    }
  ) => void;
  rowActions?: ISourceTableBaseRowActions;
  extraActions?: Array<React.ReactElement<IExtraActionProps>>;
  totalFooter?: boolean;
  totalColDef?: IColumnDef;
  createButtonProps?: ButtonProps;
}

export interface TableRowEventData {
  rowId: string;
  rowData: any;
  rowIndex: number;
  originEvent?: Event;
  params: ActionCellRendererClassParams;
}

export interface SourceTableState {
  tableDataSource?: any[];
  searchFormData?: any;
  tableFormData?: any;
  createFormData?: any;
  tableColumnDefs?: IColumnDef[];
  loading?: boolean;
  pagination?: ISourceTableBasePagination;
  saveLoading?: boolean;
  resetLoading?: boolean;
}

export type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface ISourceTableReturnValue {
  state?: SourceTableState;
  type?: NoticeType;
  message?: string;
  fetch?: boolean;
}

export type ISourceTableActionReturnValue =
  | void
  | boolean
  | SourceTableState
  | ISourceTableReturnValue;

export type ISourceTableOnCreate = (
  event: SourceTableState
) => ISourceTableActionReturnValue | Promise<ISourceTableActionReturnValue>;

export type ISourceTableOnSearch = (
  event: SourceTableState
) => any[] | ISourceTableActionReturnValue | Promise<any[] | ISourceTableActionReturnValue>;

export type ISourceTableOnReset = (
  event: SourceTableState
) => any[] | ISourceTableActionReturnValue | Promise<any[] | ISourceTableActionReturnValue>;

export type ISourceTableOnSave = (
  event: SourceTableState
) => ISourceTableActionReturnValue | Promise<ISourceTableActionReturnValue>;

export type ISourceTableOnRemove = (
  event: TableRowEventData,
  state: SourceTableState
) => ISourceTableActionReturnValue | Promise<ISourceTableActionReturnValue>;

export type ISourceTableOnInsert = (
  event: SourceTableState,
  state: SourceTableState
) => ISourceTableActionReturnValue | Promise<ISourceTableActionReturnValue>;

export type ISourceTableRowActionFunction = ((
  event: TableRowEventData,
  state: SourceTableState
) => IStateRowActions);

export type ISourceTableRowActions = IStateRowActions | ISourceTableRowActionFunction;

export interface SourceTableProps
  extends Omit<
    SourceTableBaseProps,
    | 'createFormControls'
    | 'searchFormControls'
    | 'tableColumnDefs'
    | 'onCreate'
    | 'onRemove'
    | 'onInsert'
    | 'rowActions'
  > {
  searchFormControls?: IFormControl[] | ((event: SourceTableState) => IFormControl[]);
  createFormControls?: IFormControl[] | ((event: SourceTableState) => IFormControl[]);
  tableColumnDefs?: ((event: SourceTableState) => IColumnDef[]) | IColumnDef[];
  autoFetch?: boolean;
  fetchAfterSearchFormChanged?: boolean;
  onCreate?: ISourceTableOnCreate;
  onRemove?: ISourceTableOnRemove;
  onSearch?: ISourceTableOnSearch;
  onReset?: ISourceTableOnReset;
  onSave?: ISourceTableOnSave;
  onInsert?: ISourceTableOnInsert;
  rowActions?: ISourceTableRowActions;
}
