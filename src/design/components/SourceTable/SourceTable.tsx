import React from 'react';
import StationalComponent from '../StationalComponent';
import SourceTableBase from './SourceTableBase';
import { SourceTableProps, SourceTableState } from './types';

class SourceTable extends StationalComponent<SourceTableProps, SourceTableState> {
  public $baseSourceTable: SourceTableBase = null;

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
    };
  }

  public refresh = () => {
    if (this.$baseSourceTable) {
      this.$baseSourceTable.$table.$baseTable.gridApi.refreshView();
    }
  };

  public validateTableForm = () => {
    return new Promise(resolve => {
      this.$baseSourceTable.$tableForm.validateFieldsAndScroll((errors, values) => {
        if (errors) {
          return resolve({
            error: true,
            message: errors,
          });
        }
        return resolve({
          error: false,
        });
      });
    });
  };

  public validateSearchForm = () => {
    return new Promise(resolve => {
      this.$baseSourceTable.$searchForm.validateFieldsAndScroll((errors, values) => {
        if (errors) {
          return resolve({
            error: true,
            message: errors,
          });
        }
        return resolve({
          error: false,
        });
      });
    });
  };

  public validateTable = async () => {
    return this.$baseSourceTable.$table.$baseTable.validateTableCells().then(results => {
      if (results.some(item => item.error)) {
        return {
          error: true,
          message: results.map(item => item.message),
        };
      }
      return {
        error: false,
      };
    });
  };

  public onResetButtonClick = params => {
    if (!this.props.onResetButtonClick) {
      return this.$setState(
        {
          searchFormData: {},
        },
        () => {
          this.props.onSearchButtonClick({
            ...params,
            searchFormData: {},
          });
        }
      );
    }
    return this.props.onResetButtonClick(params);
  };

  public getBaseTableRef = node => {
    this.$baseSourceTable = node;
  };

  public render() {
    return <SourceTableBase ref={this.getBaseTableRef} {...this.props} {...this.getUsedState()} />;
  }
}

export default SourceTable;
