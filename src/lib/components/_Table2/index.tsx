// import 'ag-grid-enterprise';
import { Omit } from '@/lib/viewModel';
import React, { PureComponent } from 'react';
import TableBase from './base';
import { TableBaseProps } from './interface';

export interface TableProps extends Omit<TableBaseProps, 'pagination'> {
  pagination?:
    | boolean
    | {
        current: number;
        pageSize: number;
        total: number;
      };
}

class Table extends PureComponent<TableProps, any> {
  public static defaultProps = {
    paginationProps: {},
  };

  public $baseTable: TableBase = null;

  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: this.props.paginationProps.defaultCurrent || 1,
        pageSize: this.props.paginationProps.defaultPageSize || 20,
        total: props.rowData.length,
      },
    };
  }

  public getPagination = () => {
    if (typeof this.props.pagination === 'boolean') {
      return false;
    }

    return {
      total: this.props.rowData.length,
      ...this.state.pagination,
      ...this.props.pagination,
    };
  };

  public controlPagination = () => {
    if (this.props.pagination === undefined) {
      return false;
    }
    return this.props.pagination !== false;
  };

  public onPaginationChange = (current: number, pageSize?: number) => {
    if (this.props.onPaginationChange) {
      this.props.onPaginationChange(current, pageSize);
    }

    if (!this.controlPagination()) {
      this.setState({
        pagination: {
          ...this.state.pagination,
          current,
          pageSize,
        },
      });
    }
  };

  public onPaginationShowSizeChange = (current: number, pageSize: number) => {
    if (this.props.onPaginationShowSizeChange) {
      this.props.onPaginationShowSizeChange(current, pageSize);
    }

    if (!this.controlPagination()) {
      this.setState({
        pagination: {
          ...this.state.pagination,
          current,
          pageSize,
        },
      });
    }
  };

  public getRef = node => {
    this.$baseTable = node;
  };

  public render() {
    return (
      <TableBase
        {...this.props}
        ref={this.getRef}
        pagination={this.getPagination()}
        onPaginationChange={this.onPaginationChange}
        onPaginationShowSizeChange={this.onPaginationShowSizeChange}
      />
    );
  }
}

export default Table;
