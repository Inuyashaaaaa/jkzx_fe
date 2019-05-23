import { isShallowEqual, remove, securityCall } from '@/tools';
import { message, notification } from 'antd';
import _ from 'lodash';
import memo from 'memoize-one';
import React, { PureComponent } from 'react';
import { ITablePagination } from '../_Table2';
import SourceTableBase from './base';
import {
  ISourceTableActionReturnValue,
  ISourceTableReturnValue,
  ISourceTableRowActionFunction,
  SourceTableProps,
  SourceTableState,
  TableRowEventData,
} from './interface';
import { IRowActionProps } from './rendering/ActionCellRendererClass';

class SourceTable extends PureComponent<SourceTableProps, SourceTableState> {
  public static defaultProps = {
    autoFetch: true,
    paginationProps: {},
  };

  public debounceSearch: any;

  public $baseSourceTable: SourceTableBase = null;

  public getFunctionTableColumnDefs = memo(
    (tableColumnDefs, stationalData) => {
      if (typeof tableColumnDefs === 'function') {
        return tableColumnDefs(stationalData);
      }
      return tableColumnDefs;
    },
    (a, b) => isShallowEqual(a, b)
  );

  public getCreateFormControls = memo(
    (createFormControls, stationalData) => {
      if (typeof createFormControls === 'function') {
        return createFormControls(stationalData);
      }
      return createFormControls;
    },
    (a, b) => isShallowEqual(a, b)
  );

  public getSearchFormControls = memo(
    (searchFormControls, stationalData) => {
      if (typeof searchFormControls === 'function') {
        return searchFormControls(stationalData);
      }
      return searchFormControls;
    },
    (a, b) => isShallowEqual(a, b)
  );

  constructor(props) {
    super(props);

    const propsPaginationProps = props.paginationProps || {};
    const propsDataSource = props.dataSource || [];

    this.state = {
      tableDataSource: [],
      searchFormData: {},
      tableFormData: {},
      createFormData: {},
      tableColumnDefs: [],
      loading: false,
      pagination: {
        current: propsPaginationProps.defaultCurrent || 1,
        pageSize: propsPaginationProps.defaultPageSize || 20,
        total: propsDataSource.length,
      },
    };

    this.debounceSearch = _.debounce(this.search, 200);
  }

  public componentDidMount = () => {
    if (this.props.autoFetch && !this.controlTableDataSource()) {
      this.onSearch(this.getStationlData());
    }
  };

  public controlTableDataSource = () => !!this.props.dataSource;

  public controlSaveLoading = () => !!this.props.saveLoading;

  public controlResetLoading = () => !!this.props.resetLoading;

  public controlLoading = () => !!this.props.loading;

  public controlPagination = () => {
    if (this.props.pagination === undefined) {
      return false;
    }
    return this.props.pagination !== false;
  };

  public save = event => {
    if (!this.controlSaveLoading()) {
      this.setState({
        saveLoading: true,
      });
    }

    return securityCall(
      () => this.props.onSave(event),
      result => {
        if (!this.controlSaveLoading()) {
          this.setState({
            saveLoading: false,
          });
        }

        if (!result) return false;

        const normalizeValue = this.normalizeRetrunValue(result, {
          message: '保存成功',
          type: 'success',
        });

        this.setState(normalizeValue.state, () => {
          if (normalizeValue.message) {
            message[normalizeValue.type](normalizeValue.message);
          }
        });

        if (normalizeValue.fetch) {
          this.search();
        }

        return true;
      },
      error => {
        if (!this.controlSaveLoading()) {
          this.setState({
            saveLoading: false,
          });
        }
        notification.warn({
          message: '保存异常',
          description: error.toString(),
        });
      }
    );
  };

  public validateSave = event => {
    if (!this.$baseSourceTable.$tableForm) {
      return this.validateTableSave(event);
    }
    return this.$baseSourceTable.$tableForm.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      return this.validateTableSave(event);
    });
  };

  public validateTableSave = event => {
    return this.$baseSourceTable.$table.$baseTable.validateTableCells().then(results => {
      if (results.some(item => item.error)) {
        return;
      }
      return this.save(event);
    });
  };

  public onSave = event => {
    if (!this.props.onSave) return;

    return this.validateSave(event);
  };

  public onReset = event => {
    if (this.props.onReset) {
      return this.props.onReset(event);
    }

    if (!this.props.searchFormData) {
      this.setState(
        {
          searchFormData: {},
        },
        () => this.onSearch(this.getStationlData())
      );
    }
  };

  public onCreate = values => {
    if (!this.props.onCreate) return;

    return securityCall(
      () => this.props.onCreate(this.getStationlData()),
      result => {
        if (!result) return false;

        const normalizeValue = this.normalizeRetrunValue(result, {
          message: '创建成功',
          type: 'success',
          state: {
            createFormData: {},
          },
        });

        this.setState(normalizeValue.state, () => {
          if (normalizeValue.message) {
            message[normalizeValue.type](normalizeValue.message);
          }
        });

        if (normalizeValue.fetch) {
          this.search();
        }

        return true;
      },
      error => {
        notification.warn({
          message: '确认异常',
          description: error.toString(),
        });
        return error;
      }
    );
  };

  public searchSilent = (event = this.getStationlData(), callback?) => {
    return securityCall(
      () => this.props.onSearch(event),
      result => {
        if (callback) {
          callback(result);
        }

        if (!result) return false;

        if (Array.isArray(result)) {
          result = {
            tableDataSource: result,
          };
        }

        const normalizeValue = this.normalizeRetrunValue(result, {
          message: null,
        });

        this.setState(normalizeValue.state, () => {
          if (normalizeValue.message) {
            message[normalizeValue.type](normalizeValue.message);
          }
        });

        return true;
      },
      error => {
        notification.warn({
          message: '搜索异常',
          description: error.toString(),
        });
        return error;
      }
    );
  };

  public search = (event = this.getStationlData()) => {
    if (!this.controlLoading()) {
      this.setState({
        loading: true,
      });
    }

    return this.searchSilent(event, () => {
      if (!this.controlLoading()) {
        this.setState({
          loading: false,
        });
      }
    });
  };

  public validateSearch = event => {
    if (!this.$baseSourceTable.$searchForm) {
      return this.search(event);
    }

    return this.$baseSourceTable.$searchForm.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }

      return this.search(event);
    });
  };

  public onSearch = event => {
    if (!this.props.onSearch) return;

    return this.validateSearch(event);
  };

  public onRemove = event => {
    if (!this.props.onRemove) return;

    return securityCall(
      () => this.props.onRemove(event, this.getStationlData()),
      result => {
        if (!result) return false;

        const normalizeValue = this.normalizeRetrunValue(
          result,
          {
            message: '删除成功',
            type: 'success',
            state: {
              tableDataSource: remove(this.state.tableDataSource, event.rowIndex),
            },
          },
          {
            message: '删除失败',
            type: 'error',
          }
        );

        this.setState(normalizeValue.state, () => {
          if (normalizeValue.message) {
            message[normalizeValue.type](normalizeValue.message);
          }
        });

        if (normalizeValue.fetch) {
          this.search();
        }

        return true;
      },
      error => {
        notification.warn({
          message: '删除异常',
          description: error.toString(),
        });
        return error;
      }
    );
  };

  public copyRowData = rowId => {
    const clone = _.clone(
      this.getTableDataSource().find(item => item[this.props.rowKey] === rowId)
    );
    clone[this.props.rowKey] = new Date().getTime() + '';
    return clone;
  };

  public insert = (rowIndex: number, rowData: any) => {
    if (!rowData) return;

    if (!this.controlTableDataSource()) {
      const clone = [...this.state.tableDataSource];
      clone.splice(rowIndex + 1, 0, rowData);
      this.setState({
        tableDataSource: clone,
      });
    }
  };

  public onInsert = event => {
    if (!this.props.onInsert) return;

    return securityCall(
      () => this.props.onInsert(event, this.getStationlData()),
      result => {
        if (!result) return false;

        const normalizeValue = this.normalizeRetrunValue(result, {
          message: '插入数据成功',
          type: 'success',
        });

        this.setState(normalizeValue.state, () => {
          if (normalizeValue.message) {
            message[normalizeValue.type](normalizeValue.message);
          }
        });

        if (normalizeValue.fetch) {
          this.search();
        }

        return true;
      },
      error => {
        notification.warn({
          message: '插入数据异常',
          description: error.toString(),
        });
      }
    );
  };

  public normalInsertResult = (result, rowId) => {
    if (typeof result === 'object' && !Array.isArray(result)) {
      if (result.message && result.rowData) {
        return result;
      }

      return {
        message: '插入数据成功',
        error: false,
        rowData: result,
      };
    }

    if (typeof result === 'boolean') {
      return {
        message: result ? '插入数据成功' : '插入数据失败',
        error: !result,
        rowData: result ? this.copyRowData(rowId) : null,
      };
    }

    if (typeof result === 'string') {
      return {
        message: result,
        error: false,
        rowData: this.copyRowData(rowId),
      };
    }
  };

  public getSearchFormData = () => this.props.searchFormData || this.state.searchFormData;

  public getTableFormData = () => this.props.tableFormData || this.state.tableFormData;

  public getTableDataSource = () => this.props.dataSource || this.state.tableDataSource;

  public getLoading = () => this.props.loading || this.state.loading;

  public getSaveLoading = () => this.props.saveLoading || this.state.saveLoading;

  public getResetLoading = () => this.props.resetLoading || this.state.resetLoading;

  public getTableColumnDefs = () => this.props.tableColumnDefs || this.state.tableColumnDefs;

  public getCreateFormData = () => this.props.createFormData || this.state.createFormData;

  public getBaseTableRef = node => {
    this.$baseSourceTable = node;
  };

  public onCreateFormChange = (values, tableData, tableFormData, changed) => {
    if (this.props.onCreateFormChange) {
      this.props.onCreateFormChange(values, tableData, tableFormData, changed);
    }

    if (!this.props.createFormData) {
      this.setState({
        createFormData: values,
      });
    }
  };

  public onTableFormChange = event => {
    if (this.props.onTableFormChange) {
      this.props.onTableFormChange(event);
    }

    if (!this.props.tableFormData) {
      this.setState({
        tableFormData: event.formData,
      });
    }
  };

  public onSearchFormChange = event => {
    if (this.props.onSearchFormChange) {
      this.props.onSearchFormChange(event);
    }

    if (!this.props.searchFormData) {
      this.setState(
        {
          searchFormData: event.formData,
        },
        () => {
          if (this.props.fetchAfterSearchFormChanged) {
            this.debounceSearch();
          }
        }
      );
    }
  };

  public onPaginationChange = (current: number, pageSize?: number) => {
    if (this.props.onPaginationChange) {
      this.props.onPaginationChange(current, pageSize);
    }

    if (!this.controlPagination()) {
      this.setState(
        {
          // tslint:disable-next-line:no-object-literal-type-assertion
          pagination: {
            ...this.normalStatePagination(),
            current,
            pageSize,
          } as ITablePagination,
        },
        () => {
          if (this.props.paginationProps.backend && !this.controlTableDataSource()) {
            this.onSearch(this.getStationlData());
          }
        }
      );
    }
  };

  public onPaginationShowSizeChange = (current: number, pageSize: number) => {
    if (this.props.onPaginationShowSizeChange) {
      this.props.onPaginationShowSizeChange(current, pageSize);
    }

    if (!this.controlPagination()) {
      this.setState(
        {
          // tslint:disable-next-line:no-object-literal-type-assertion
          pagination: {
            ...this.normalStatePagination(),
            current,
            pageSize,
          } as ITablePagination,
        },
        () => {
          if (this.props.paginationProps.backend && !this.controlTableDataSource()) {
            this.onSearch(this.getStationlData());
          }
        }
      );
    }
  };

  public getStationlData = (): SourceTableState => {
    return {
      createFormData: this.getCreateFormData(),
      searchFormData: this.getSearchFormData(),
      tableDataSource: this.getTableDataSource(),
      tableFormData: this.getTableFormData(),
      loading: this.getLoading(),
      saveLoading: this.getSaveLoading(),
      resetLoading: this.getResetLoading(),
      pagination: this.getPagination(),
    };
  };

  public getPagination = () => {
    if (typeof this.props.pagination === 'boolean') {
      return false;
    }

    return {
      total: this.getTableDataSource().length,
      ...this.normalStatePagination(),
      ...this.props.pagination,
    };
  };

  public getRowActions = () => {
    if (!this.props.rowActions) return;

    if (typeof this.props.rowActions === 'function') {
      return (event: TableRowEventData) =>
        this.bindRowActionsState(
          (this.props.rowActions as ISourceTableRowActionFunction)(event, this.getStationlData())
        );
    }

    return this.bindRowActionsState(this.props.rowActions);
  };

  public render() {
    const stationlData = this.getStationlData();

    return (
      <SourceTableBase
        ref={this.getBaseTableRef}
        {...this.props}
        {...stationlData}
        dataSource={stationlData.tableDataSource}
        tableColumnDefs={this.getFunctionTableColumnDefs(this.getTableColumnDefs(), stationlData)}
        createFormData={this.getCreateFormData()}
        createFormControls={this.getCreateFormControls(this.props.createFormControls, stationlData)}
        searchFormControls={this.getSearchFormControls(this.props.searchFormControls, stationlData)}
        onCreateFormChange={this.onCreateFormChange}
        onTableFormChange={this.onTableFormChange}
        onSearchFormChange={this.onSearchFormChange}
        onRemove={this.onRemove}
        onInsert={this.onInsert}
        // removeLoadings={this.getRemoveLoadings()}
        onCreate={this.onCreate}
        onSave={this.onSave}
        onSearch={this.onSearch}
        onReset={this.onReset}
        paginationProps={this.props.paginationProps}
        onPaginationChange={this.onPaginationChange}
        onPaginationShowSizeChange={this.onPaginationShowSizeChange}
        rowActions={this.getRowActions()}
      />
    );
  }

  private bindRowActionsState = rowActions => {
    return rowActions.map((element, index) => {
      return React.cloneElement<IRowActionProps>(element, {
        ...element.props,
        onClick: this.bindActionClick(element.props.onClick, index),
      });
    });
  };

  private bindActionClick = (preClick, index: number) => (event: TableRowEventData) => {
    if (!preClick) return;
    return securityCall(
      () =>
        preClick({
          ...event,
          state: this.getStationlData(),
        }),
      result => {
        if (!result) return result;

        const normalizeValue = this.normalizeRetrunValue(result, {
          message: null,
        });

        this.setState(normalizeValue.state, () => {
          if (normalizeValue.message) {
            message[normalizeValue.type](normalizeValue.message);
          }
        });

        return result;
      },
      error => {
        notification.warn({
          message: '操作异常',
          description: error.toString(),
        });
      }
    );
  };

  private isBackendPagination = () => {
    return _.get(this.props.paginationProps, 'backend', false);
  };

  private normalStatePagination = () => {
    return typeof this.state.pagination === 'boolean' ? {} : this.state.pagination;
  };

  private normalizeRetrunValue = (
    value: ISourceTableActionReturnValue,
    successDefaults?: ISourceTableReturnValue,
    errrorDefaults?: ISourceTableReturnValue
  ): ISourceTableReturnValue => {
    const defaultSuccess: ISourceTableReturnValue = {
      message: '操作成功',
      type: 'success',
      fetch: this.isBackendPagination(),
    };

    if (typeof value === 'boolean') {
      if (value) {
        return {
          ...defaultSuccess,
          ...successDefaults,
        };
      } else {
        return {
          message: '操作失败',
          type: 'error',
          ...errrorDefaults,
        };
      }
    }

    const retunValue = value as ISourceTableReturnValue;
    if (!retunValue.state && !retunValue.message) {
      return _.merge(defaultSuccess, successDefaults, {
        state: value,
      });
    }

    return _.merge(defaultSuccess, successDefaults, value);
  };

  // getRemoveLoadings = () => this.props.removeLoadings || this.state.removeLoadings;

  // controlRemoveLoadings = () => !!this.props.removeLoadings;

  // changeRemoveLoadings = (rowId, bool, callback?) => {
  //   this.setState(
  //     {
  //       removeLoadings: {
  //         ...this.state.removeLoadings,
  //         [rowId]: bool,
  //       },
  //     },
  //     callback
  //   );
  // };

  // _onRemove = event => {
  //   judagePromise(this.props.onRemove(event), result => {
  //     if (!this.controlRemoveLoadings()) {
  //       this.changeRemoveLoadings(event.rowId, false);
  //     }

  //     if (!result) return;

  //     if (!this.controlTableDataSource()) {
  //       this.state.tableDataSource.splice(event.rowIndex, 1);
  //       this.setState({
  //         tableDataSource: [...this.state.tableDataSource],
  //       });
  //     }
  //   });
  // };

  // onRemove = event => {
  //   if (!this.props.onRemove) return;

  //   if (this.controlRemoveLoadings()) {
  //     this._onRemove(event);
  //   } else {
  //     this.changeRemoveLoadings(event.rowId, true, () => {
  //       this._onRemove(event);
  //     });
  //   }
  // };
}

export default SourceTable;
export * from './constants';
export * from './interface';
