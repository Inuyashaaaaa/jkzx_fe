import { GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community';
import { Button, Divider } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import memo from 'memoize-one';
import React, { PureComponent } from 'react';
import Form from '../../components/Form';
import Table from '../../components/Table';
import { IColDef, IGetHorizontalrColumnDef } from '../../components/Table/types';
import { someDeep } from '../../utils';
import Loading from '../Loading';
import { DEFAULT_CONTEXT_MENU_ITEMS } from '../Table/constants';
import { TOTAL_DATA_ID, TOTAL_DATA_TAG, VERTICAL_GUTTER } from './constants';
import ActionCellRendererClass from './rendering/ActionCellRendererClass';
import { IInputTypeColDef, ITableDataSource, SourceTableBaseProps } from './types';

const ButtonGroup = Button.Group;

class SourceTableBase extends PureComponent<SourceTableBaseProps, any> {
  public static defaultProps = {
    columnDefs: [],
    searchFormControls: [],
    resetable: false,
    searchable: false,
    searchText: '搜 索',
    resetText: '重 置',
    tableFormProps: {},
    searchFormProps: {},
    actionColDef: {},
  };

  public state = {
    forceUpdateTotalFooter: 0,
  };

  public $table: Table = null;

  public $tableForm: WrappedFormUtils = null;

  public $createForm: WrappedFormUtils = null;

  public $searchForm: WrappedFormUtils = null;

  public totalDataTpl: object;

  public injectTotalFooter = memo(
    (tableData, totalFooter, tableColumnDefs, forceUpdateTotalFooter) => {
      if (tableData.length && totalFooter) {
        const totalData = this.calculateTotalData(
          tableData,
          tableColumnDefs,
          forceUpdateTotalFooter
        );
        return tableData.concat(totalData);
      }
      return tableData;
    }
  );

  public calculateTotalData = memo((tableData, tableColumnDefs, forceUpdateTotalFooter) => {
    const inputTypeColDefs: IInputTypeColDef[] = tableColumnDefs
      .map((colDef: IColDef) => {
        return this.transformColDef(colDef);
      })
      .filter((colDef: IInputTypeColDef) => this.getTotalColCanCalculate(colDef));

    return inputTypeColDefs.reduce((totalData, inputTypeColDef) => {
      return this.calculateTotalColData(inputTypeColDef, tableData, totalData);
    }, this.totalDataTpl);
  });

  public transformColDef = memo(
    (colDef: IColDef): IInputTypeColDef => {
      const inputType = colDef.input
        ? typeof colDef.input === 'function'
          ? colDef.input({}).type
          : colDef.input.type
        : 'input';
      return {
        ...colDef,
        inputType,
      };
    }
  );

  public injectActionColumnDefs = memo((columnDefs, actionColDef) => {
    return columnDefs.concat({
      headerName: '操作',
      field: '操作',
      ...actionColDef,
      cellRenderer: 'ActionCellRendererClass',
      editable: false,
      cellRendererParams: {
        ...actionColDef.cellRendererParams,
        rowActions: params => {
          if (typeof this.props.rowActions === 'function') {
            return this.props.rowActions(params);
          }
          return this.props.rowActions || [];
        },
      },
    });
  });

  public getColumnEditable = memo(columnDefs => {
    return someDeep(columnDefs, item => item.editable);
  });

  constructor(props) {
    super(props);
    if (!props.rowKey) {
      throw new Error('rowKey is must be exist!');
    }

    this.totalDataTpl = {
      [props.rowKey]: TOTAL_DATA_ID,
      [TOTAL_DATA_TAG]: true,
    };

    this.state = {
      forceUpdateTotalFooter: 0,
    };
  }

  public onCellValueChanged = params => {
    if (this.props.totalable || this.props.columnDefs.some(item => item.totalable)) {
      if (
        this.getTotalColCanCalculate({
          totalable: this.props.totalable,
          ...this.transformColDef(params.colDef),
        })
      ) {
        this.setState({
          forceUpdateTotalFooter: this.state.forceUpdateTotalFooter + 1,
        });
      }
    }

    if (this.props.onCellValueChanged) {
      return this.props.onCellValueChanged(params);
    }
  };

  public calculateTotalColData = (
    inputTypeColDef: IInputTypeColDef,
    tableData: ITableDataSource,
    totalColData?: object
  ) => {
    const { field, calculateTotalData } = inputTypeColDef;

    return tableData.reduce((totalData, record) => {
      if (calculateTotalData) {
        return {
          ...totalData,
          [field]: calculateTotalData({ totalData: totalData[field], record }),
        };
      }

      let val;
      if (_.isNumber(record[field])) {
        val =
          totalData[field] === undefined
            ? record[field]
            : new BigNumber(record[field])
                .plus(totalData[field])
                .decimalPlaces(4)
                .toNumber();
      }

      return {
        ...totalData,
        [field]: val,
      };
    }, totalColData || {});
  };

  public getTotalColCanCalculate = (inputTypeColDef: IInputTypeColDef) => {
    const { inputType, calculateTotalData, totalable } = inputTypeColDef;
    return (inputType === 'number' || calculateTotalData) && totalable !== false;
  };

  public searchFormRef = node => {
    // hot reload
    if (!node) return;
    this.$searchForm = node.props.form;
    if (this.props.searchFormProps.wrappedComponentRef) {
      this.props.searchFormProps.wrappedComponentRef(node);
    }
  };

  public tableFormRef = node => {
    // hot reload
    if (!node) return;
    this.$tableForm = node.props.form;
    if (this.props.tableFormProps.wrappedComponentRef) {
      this.props.tableFormProps.wrappedComponentRef(node);
    }
  };

  public getHorizontalrColumnDef: IGetHorizontalrColumnDef = params => {
    const { rowData } = params;
    const { getHorizontalrColumnDef, totalable, totalColDef } = this.props;

    if (totalable && rowData[TOTAL_DATA_TAG]) {
      return {
        headerName: '总计',
        suppressFilter: true,
        ...totalColDef,
      };
    }

    if (getHorizontalrColumnDef) {
      return getHorizontalrColumnDef(params);
    }
  };

  public getRowIndexById = rowId => {
    return this.props.dataSource.findIndex(item => item[this.props.rowKey] === rowId);
  };

  public getTableRef = node => {
    this.$table = node;
  };

  public getContextMenuItems = (params: GetContextMenuItemsParams): Array<MenuItemDef | string> => {
    if (this.props.getContextMenuItems) {
      return this.props.getContextMenuItems(params);
    }
    return DEFAULT_CONTEXT_MENU_ITEMS;
  };

  public onSearchButtonClick = params => {
    const { domEvent } = params;
    if (this.props.onSearchButtonClick) {
      return this.props.onSearchButtonClick({
        domEvent,
        searchFormData: this.getSearchFormData(),
      });
    }
  };

  public onResetButtonClick = params => {
    const { domEvent } = params;
    if (this.props.onResetButtonClick) {
      return this.props.onResetButtonClick({
        domEvent,
        searchFormData: this.getSearchFormData(),
      });
    }
  };

  public getSearchFormData = () => {
    return this.props.searchFormData || this.$searchForm.getFieldsValue();
  };

  public render() {
    const {
      rowKey,
      editable,
      action,
      tableFormControls,
      tableFormProps,
      searchButtonProps,
      searchText,
      actionColDef,
      tableFormData,
      loading,
      style,
      onSearchFormChange,
      searchable,
      searchFormData,
      searchFormControls,
      searchFormProps,
      resetButtonProps,
      resetLoading,
      resetText,
      onTableFormChange,
      columnDefs,
      dataSource,
      totalable,
      onSearchButtonClick,
      dobuleAction,
      onResetButtonClick,
      vertical,
      frameworkComponents,
      defaultColDef,
      context,
      resetable,
      rowActions,
      header,
      footer,
      ...tableProps
    } = this.props;

    const hasActionCol = !!rowActions && !!dataSource.length;

    return (
      <div style={style}>
        {searchable && (
          <>
            <Form
              layout="inline"
              {...searchFormProps}
              resetable={resetable}
              resetButtonProps={resetButtonProps}
              onResetButtonClick={this.onResetButtonClick}
              resetLoading={resetLoading}
              resetText={resetText}
              submitButtonProps={{
                icon: 'search',
                type: 'primary',
                ...searchButtonProps,
              }}
              submitText={searchText}
              onSubmitButtonClick={this.onSearchButtonClick}
              wrappedComponentRef={this.searchFormRef}
              controls={searchFormControls}
              dataSource={searchFormData}
              onValueChange={onSearchFormChange}
            />
            <Divider />
          </>
        )}
        {header}
        <Loading loading={loading}>
          {tableFormControls && (
            <Form
              layout="inline"
              {...tableFormProps}
              style={{
                marginBottom: VERTICAL_GUTTER,
                ...tableFormProps.style,
              }}
              wrappedComponentRef={this.tableFormRef}
              footer={false}
              controls={this.props.tableFormControls}
              onValueChange={onTableFormChange}
              dataSource={tableFormData}
            />
          )}
          <Table
            {...tableProps}
            vertical={vertical}
            ref={this.getTableRef}
            loading={false}
            rowKey={rowKey}
            getContextMenuItems={this.getContextMenuItems}
            getHorizontalrColumnDef={this.getHorizontalrColumnDef}
            onCellValueChanged={this.onCellValueChanged}
            rowData={this.injectTotalFooter(
              dataSource,
              totalable,
              columnDefs,
              this.state.forceUpdateTotalFooter
            )}
            columnDefs={
              hasActionCol && !vertical
                ? this.injectActionColumnDefs(columnDefs, actionColDef)
                : columnDefs
            }
            frameworkComponents={{
              ...frameworkComponents,
              ActionCellRendererClass,
            }}
            defaultColDef={{
              ...defaultColDef,
              editable,
            }}
            context={{
              ...context,
              rowKey,
              getRowIndexById: this.getRowIndexById,
            }}
          />
        </Loading>
        {footer}
      </div>
    );
  }
}

export default SourceTableBase;
export * from './constants';
export * from './types';
