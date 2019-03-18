import { ICellRendererParams } from 'ag-grid-community';
import React from 'react';

export interface ISourceTableRowActionClickHandleParams {
  rowId: string;
  rowData: any;
  rowIndex: number;
}

export interface IRowActionProps<T = void, S = any> {
  onClick?: (event: ISourceTableRowActionClickHandleParams & S) => T;
  loading?: boolean;
}

export interface ActionCellRendererClassBaseParams extends ICellRendererParams {
  rowActions?: (
    params: ISourceTableRowActionClickHandleParams
  ) => Array<React.ReactElement<IRowActionProps>>;
  actionLoadings?: boolean[];
}

export interface ActionCellRendererClassParams extends ActionCellRendererClassBaseParams {}

export interface ActionCellRendererClassState {
  actionLoadings?: boolean[];
}
