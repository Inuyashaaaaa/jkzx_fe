// import 'ag-grid-enterprise';
import React from 'react';
import StationalComponent from '../StationalComponent';
import TableBase from './TableBase';
import { TableProps, TableState } from './types';

class Table extends StationalComponent<TableProps, TableState> {
  public static defaultProps = {
    paginationProps: {},
  };

  public static getDerivedStateFromProps = (props, state) => {
    if (props.paginationProps.backend) return null;
    return {
      pagination: {
        ...state.pagination,
        total: props.rowData ? props.rowData.length : null,
      },
    };
  };

  public $baseTable: TableBase = null;

  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        current: this.props.paginationProps.defaultCurrent || 1,
        pageSize: this.props.paginationProps.defaultPageSize || 20,
      },
    };
  }

  public onPaginationChange = params => {
    if (!this.props.onPaginationChange) {
      return this.$setState(params);
    }
    return this.props.onPaginationChange(params);
  };

  public onPaginationShowSizeChange = params => {
    if (!this.props.onPaginationShowSizeChange) {
      return this.$setState(params);
    }
    return this.props.onPaginationShowSizeChange(params);
  };

  public getRef = node => {
    this.$baseTable = node;
  };

  public getPagination = () => {
    return this.getUsedStateField('pagination') || {};
  };

  public render() {
    return (
      <TableBase
        {...this.state}
        {...this.props}
        ref={this.getRef}
        onPaginationChange={this.onPaginationChange}
        onPaginationShowSizeChange={this.onPaginationShowSizeChange}
      />
    );
  }
}

export default Table;
