// import 'ag-grid-enterprise';
import {
  Column,
  ColumnApi,
  GetContextMenuItemsParams,
  GridApi,
  MenuItemDef,
  RowNode,
  TabToNextCellParams,
} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css';
import 'ag-grid-community/dist/styles/ag-theme-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { LicenseManager } from 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import { Row } from 'antd';
import Pagination from 'antd/lib/pagination';
import cls from 'classnames';
import _ from 'lodash';
import memo from 'memoize-one';
import React from 'react';
import { createEventBus, isShallowEqual } from '@/tools';
import Loading from '../Loading';
import {
  ADD_ITEM_TAG,
  DEFAULT_CONTEXT_MENU_ITEMS,
  DEFAULT_STATUS_PANEL_DEF,
  EVENT_CELL_VALUE_CHANGED,
  LOCAL_TEXT,
  VERTICAL_COLUMN_FIELD,
  VERTICAL_COLUMN_HEADER_NAME,
  VERTICAL_TABLE_HEADER_COLUMN_FIELD,
} from './constants';
import EditorCellRenderer from './editoring/EditorCellRenderer';
import './index.less';
import CustomLoadingOverlay from './overlays/CustomLoadingOverlay';
import CustomNoDataOverlay from './overlays/CustomNoDataOverlay';
import { HeatmapCellRenderer } from './rendering/HeatmapCellRenderer';
import RendererCellRenderer from './rendering/RendererCellRenderer';
import {
  IColDef,
  IColumnDef,
  IGetHorizontalrColumnDef,
  ITableGetContextMenuItemsParams,
  ITablePagination,
  ITableRowData,
  ITableRowKey,
  TableBaseProps,
  TableState,
} from './types';

LicenseManager.setLicenseKey(
  'Evaluation_License_Not_For_Production_Valid_Until26_January_2019__MTU0ODQ2MDgwMDAwMA==21a7453ae27248a2d469f10e8f54b791'
);

class TableBase extends React.Component<TableBaseProps, TableState> {
  public static defaultProps = {
    vertical: false,
    theme: 'balham',
    width: '100%',
    columnDefs: [],
    rowHeight: 34,
    autoSizeColumnsToFit: true,
    darkIfDoNotEditable: false,
    tableFormData: {},
    rowData: [],
  };

  public static defaultRowClassRules = {
    'tongyu-table-add-row': params => {
      return !!(params.data && params.data[ADD_ITEM_TAG]);
    },
  };

  public selectedRowNodes: RowNode[] = [];

  public selectedColumns: Column[] = [];

  public gridReadyQueue: Array<() => void> = [];

  public updateQueue: Array<() => void> = [];

  public gridApi: GridApi = null;

  public gridColumnApi: ColumnApi = null;

  public $table: HTMLDivElement;

  public TableEventBus = createEventBus();

  public context: any;

  public onWindowResize = _.debounce(() => {
    this.pushGridReadyQueue(() => {
      return this.props.autoSizeColumnsToFit && this.gridApi.sizeColumnsToFit();
    });
  }, 200);

  public hor2verColumnDefs = memo(
    (
      rowData: ITableRowData,
      rowKey: ITableRowKey,
      getHorizontalrColumnDef: IGetHorizontalrColumnDef
    ): IColDef[] => {
      return rowData.map(data => {
        const field = data[rowKey];
        return {
          headerName: '',
          ...(getHorizontalrColumnDef && getHorizontalrColumnDef({ rowData: data })),
          field,
          cellClassRules: {
            'tongyu-column-odd': params => {
              const { context, colDef } = params;
              const { rowKey, rowData } = context;
              const index = rowData.findIndex(item => item[rowKey] === colDef.field);
              return index % 2;
            },
            'tongyu-column-even': params => {
              const { context, colDef } = params;
              const { rowKey, rowData } = context;
              const index = rowData.findIndex(item => item[rowKey] === colDef.field);
              return !(index % 2);
            },
          },
          editable: params => {
            const { node, context, colDef: _colDef } = params;
            const { rowIndex } = node;

            const colDef = context.getVerticalTableColDefByRowIndex(rowIndex);
            const data = context.getVerticalTableRowDataByColField(params.colDef.field);
            const editable = colDef.editable;

            if (typeof editable === 'function') {
              return editable({
                ...params,
                colDef,
                data,
                node: {
                  ...node,
                  rowIndex: context.getVerticalTableRowIndexByColField(_colDef.field),
                },
              });
            }
            return editable;
          },
        };
      });
    }
  );

  public injectColumnDefs = memo((columnDefs, vertical) => {
    if (vertical) {
      columnDefs = [
        {
          width: 150,
          pinned: 'left',
          headerName: '',
          resizable: false,
          suppressMenu: true,
          field: VERTICAL_TABLE_HEADER_COLUMN_FIELD,
          input: {
            type: 'input',
          },
          cellStyle(params) {
            const { context, data } = params;
            const { columnDefs: passColumnDefs } = context;
            const actualColDef = passColumnDefs.find(
              colDef => colDef.field === data[VERTICAL_COLUMN_FIELD]
            );
            return (
              actualColDef.cellStyle || {
                background: '#f6f8f8',
              }
            );
          },
        },
        ...columnDefs,
      ];
    }

    return columnDefs;
  });

  constructor(props) {
    super(props);
    this.pushGridReadyQueue(this.checkLoading);
  }

  public shouldComponentUpdate = nextProps => {
    if (this.props.columnDefs.length !== nextProps.columnDefs.length) {
      this.updateQueue.push(() => {
        if (!this.gridApi) {
          this.gridReadyQueue.push(
            () => this.props.autoSizeColumnsToFit && this.gridApi.sizeColumnsToFit()
          );
          return;
        }
        if (this.props.autoSizeColumnsToFit) {
          this.gridApi.sizeColumnsToFit();
        }
      });
    }

    return !isShallowEqual(this.props, nextProps);
  };

  public componentDidUpdate = () => {
    this.fireUpdateQueue();
    // this.pushGridReadyQueue(this.checkLoading);
  };

  public componentWillUnmount = () => {
    window.removeEventListener('resize', this.onWindowResize);
  };

  public getRowData = (
    vertical: boolean,
    columnDefs: IColumnDef[],
    rowKey: string,
    rowData: ITableRowData
  ): ITableRowData => {
    if (vertical) {
      const verticalRowData = this.hor2ver(columnDefs, rowData, rowKey);

      return verticalRowData.map((item, index) => {
        const colDef = columnDefs[index] as IColDef;
        return {
          ...item,
          [VERTICAL_TABLE_HEADER_COLUMN_FIELD]: colDef.headerName,
          [VERTICAL_COLUMN_HEADER_NAME]: colDef.headerName,
          [VERTICAL_COLUMN_FIELD]: colDef.colId || colDef.field,
        };
      });
    }
    return rowData;
  };

  public getColumnDefs = (
    vertical: boolean,
    columnDefs: IColumnDef[],
    rowKey: string,
    getHorizontalrColumnDef: IGetHorizontalrColumnDef,
    rowData: any
  ): IColumnDef[] => {
    if (vertical) {
      columnDefs = this.hor2verColumnDefs(rowData, rowKey, getHorizontalrColumnDef);
    }
    columnDefs = this.injectColumnDefs(columnDefs, vertical);
    return columnDefs;
  };

  // rowData 编辑状态下会直接修改引用，不可以用 memo
  public hor2ver = (
    columnDefs: IColDef[],
    rowData: ITableRowData,
    rowKey: ITableRowKey
  ): ITableRowData => {
    if (rowData.length === 0) return [];
    const dist = columnDefs.map(() => ({}));
    columnDefs.forEach((column, index) => {
      const { field } = column;
      rowData.forEach(horData => {
        const mainField = horData[rowKey];
        dist[index][mainField] = horData[field];
      });
    });
    return dist;
  };

  public setCellValue = (rowId: ITableRowKey, colField: string, value: any): void => {
    if (this.props.vertical) {
      const rowNode = this.getRowNodeByVerticalColField(colField);

      colField = rowId;

      const colId = this.getColumnIdByField(colField);

      return (this.gridApi as any).valueService.setValue(rowNode, colId, value);
    }

    const rowNode = this.gridApi.getRowNode(rowId);
    const colId = this.getColumnIdByField(colField);
    return (this.gridApi as any).valueService.setValue(rowNode, colId, value);
  };

  public getRowNodeByVerticalColField = colField => {
    const { inlineRowData } = this.context;
    const rowData = inlineRowData.find(item => item[VERTICAL_COLUMN_FIELD] === colField);
    const _rowId = rowData[VERTICAL_COLUMN_FIELD];
    const rowNode = this.gridApi.getRowNode(_rowId);
    return rowNode;
  };

  public validateTableCells = (options: any = {}) => {
    const { rowId, showError } = options;
    this.gridApi.stopEditing();
    const renders: any[] = this.gridApi.getCellRendererInstances();
    return Promise.all(
      renders
        .map(item => item.componentInstance)
        .filter(item => {
          if (!item.getEditable) return false;
          if (rowId && (item.getRowData() || {})[this.props.rowKey] !== rowId) return false;
          return item.getEditable();
        })
        .map(item => item.validateCell(showError))
    );
  };

  public onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.props.autoSizeColumnsToFit) {
      params.api.sizeColumnsToFit();
      window.addEventListener('resize', this.onWindowResize);
    }
    this.fireGridReadyQueue();
  };

  public getRowNodeId = data => {
    return this.props.vertical ? data[VERTICAL_COLUMN_FIELD] : data[this.props.rowKey];
  };

  public onCellValueChanged = event => {
    // @todo cell 不需要 hack 转换 data
    this.TableEventBus.emit(EVENT_CELL_VALUE_CHANGED, event);
    if (this.props.onCellValueChanged) {
      const data = this.props.vertical
        ? this.getVerticalTableRowDataByColField(event.colDef.field)
        : event.data;
      const colDef = this.props.vertical
        ? this.getVerticalTableColDefByRowIndex(event.node.rowIndex)
        : event.colDef;

      this.props.onCellValueChanged({
        ...event,
        data,
        colDef,
      });
    }
  };

  public checkLoading = () => {
    if (!this.gridApi) return;
    // async update overlay
    setTimeout(() => {
      if (this.props.loading) {
        return this.gridApi.showLoadingOverlay();
      } else if (_.isEmpty(this.props.rowData)) {
        return this.gridApi.showNoRowsOverlay();
      }
      this.gridApi.hideOverlay();
    }, 0);
  };

  public pushGridReadyQueue = event => {
    if (this.gridApi) {
      return event();
    }
    this.gridReadyQueue.push(event);
  };

  public fireGridReadyQueue = () => {
    this.gridReadyQueue.forEach(event => event());
    this.gridReadyQueue = [];
  };

  public fireUpdateQueue = () => {
    this.updateQueue.forEach(event => event());
    this.updateQueue = [];
  };

  // note: nextCellDef 是横向的下一行
  public tabToNextCell = (params: TabToNextCellParams) => {
    if (!params.nextCellDef) {
      return params.previousCellDef;
    }

    const { vertical, columnDefs } = this.props;

    if (!vertical) return params.nextCellDef;

    const last = params.previousCellDef.rowIndex + 1 > columnDefs.length - 1;

    const nextTabMeta = {
      rowIndex: last ? 0 : params.previousCellDef.rowIndex + 1,
      column: last ? params.nextCellDef.column : params.previousCellDef.column,
      floating: last ? params.nextCellDef.floating : params.previousCellDef.floating,
    };

    /**
     * 当编辑状态下切换到不可编辑的 cell 上，会发生内存泄露
     * 判断一个 cell 是否可以编辑的函数需要如下参数，进行 hack 构造
     * @todo vertical 下的 editable 的判断，使用 context 提供的相关方法
     */
    const rowNode = this.getRowNodeByRowIndex(nextTabMeta.rowIndex);
    const colDef = nextTabMeta.column.getColDef();
    const context = this.context;

    // @todo 满足其他需要注入的参数
    const editable =
      typeof colDef.editable === 'function'
        ? colDef.editable({
            node: rowNode,
            colDef,
            context,
            data: null,
            column: null,
            api: null,
            columnApi: null,
          })
        : colDef.editable;

    if (params.editing && !editable) {
      return this.tabToNextCell({
        ...params,
        previousCellDef: {
          ...params.previousCellDef,
          rowIndex: params.previousCellDef.rowIndex + 1,
        },
        nextCellDef: {
          ...params.nextCellDef,
          rowIndex: params.nextCellDef.rowIndex + 1,
        },
      });
    }

    return nextTabMeta;
  };

  // convert api start
  public getVerticalTableRowDataByColField = colField => {
    const rowId = colField;
    return this.props.rowData.find(item => item[this.props.rowKey] === rowId);
  };

  public getColumnIdByField = colField => {
    const allColumns = this.gridColumnApi.getAllColumns();
    const columnItem = allColumns.find(item => item.getColDef().field === colField);
    return columnItem.getColId();
  };

  public getRowNodeByRowIndex = index => {
    return (this.gridApi as any).rowModel.rootNode.allLeafChildren[index];
  };

  public getVerticalTableRowDataByIndex = index => {
    // 因为表头的存在，减去 1
    return this.props.rowData[index - 1];
  };

  public getVerticalTableRowIndexByColField = field => {
    // 因为表头的存在，减去 1
    // @todo return promise
    if (this.gridApi) {
      return (
        (this.gridApi as any).columnController.gridColumns.findIndex(
          item => item.colDef.field === field
        ) - 1
      );
    }
    return 0;
  };

  public getVerticalTableColDefByRowIndex = (rowIndex: number) => {
    const { columnDefs } = this.context;
    return columnDefs[rowIndex];
  };
  // convert api end

  public sliceRowData = () => {
    if (!this.props.pagination || this.props.paginationProps.backend) return this.props.rowData;
    const { current, pageSize } = this.props.pagination as ITablePagination;
    const index = (current - 1) * pageSize;
    return this.props.rowData.slice(index, index + pageSize);
  };

  public getContextMenuItems = (params: GetContextMenuItemsParams): Array<MenuItemDef | string> => {
    if (!params.node || !params.column) {
      return [];
    }

    const rowData = this.props.vertical
      ? this.getVerticalTableRowDataByColField(params.column.getColDef().field)
      : params.node.data;

    const nextParams: ITableGetContextMenuItemsParams = {
      ...params,
      rowData,
    };

    if (this.props.getContextMenuItems) {
      return this.props.getContextMenuItems(nextParams);
    }
    return DEFAULT_CONTEXT_MENU_ITEMS;
  };

  public setRangeSelectionCellValue = value => {
    this.selectedRowNodes.map(rowNode => {
      this.selectedColumns.map(column => {
        (this.gridApi as any).valueService.setValue(rowNode, column.getColId(), value);
      });
    });
  };

  public onRangeSelectionChanged = value => {
    if (this.props.onRangeSelectionChanged) {
      this.props.onRangeSelectionChanged(value);
    }

    if (!this.$table) return;

    const rangeSelections = this.gridApi.getRangeSelections();

    if (!rangeSelections) return;

    const [{ columns, start, end }] = rangeSelections;

    const max = start.rowIndex > end.rowIndex ? start.rowIndex : end.rowIndex;
    const min = start.rowIndex < end.rowIndex ? start.rowIndex : end.rowIndex;

    const rowIds = this.props.rowData.slice(min, max + 1).map(record => record[this.props.rowKey]);

    const rowNodes = rowIds.map(id => this.gridApi.getRowNode(id));

    this.selectedRowNodes = rowNodes;
    this.selectedColumns = columns;
  };

  public onPaginationChange = (current, pageSize) => {
    if (!this.props.onPaginationChange) return;
    return this.props.onPaginationChange({
      pagination: {
        pageSize,
        current,
        total: this.getToal(),
      },
    });
  };

  public onPaginationShowSizeChange = (current, pageSize) => {
    if (!this.props.onPaginationShowSizeChange) return;
    return this.props.onPaginationShowSizeChange({
      pagination: {
        pageSize,
        current,
        total: this.getToal(),
      },
    });
  };

  public render() {
    const {
      theme,
      width,
      height,
      columnDefs,
      rowHeight,
      vertical,
      rowKey,
      frameworkComponents,
      darkIfDoNotEditable,
      title,
      rowClassRules,
      rowData,
      context,
      getHorizontalrColumnDef,
      defaultColDef,
      unionId,
      enableSorting,
      ...rest
    } = this.props;

    const inlineRowData = this.getRowData(vertical, columnDefs, rowKey, this.sliceRowData());
    const inlineColumnDefs = this.getColumnDefs(
      vertical,
      columnDefs,
      rowKey,
      getHorizontalrColumnDef,
      rowData
    );

    return [
      typeof title === 'string' ? <div className="tongyu-table-title">{title}</div> : title,
      <Loading key="table" loading={!!this.props.loading}>
        <div
          ref={node => (this.$table = node)}
          className={cls(`ag-theme-${theme}`, `tongyu-table`, {
            vertical,
          })}
          style={{
            height,
            width,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
            <div style={{ overflow: 'hidden', flexGrow: 1 }}>
              <AgGridReact
                animateRows={true}
                gridAutoHeight={height !== undefined ? false : true}
                // enableColResize
                // enableFilter
                // enableRangeSelection
                statusBar={DEFAULT_STATUS_PANEL_DEF}
                rowHeight={rowHeight}
                {...rest}
                enableSorting={vertical ? false : enableSorting}
                // https://www.ag-grid.com/javascript-grid-data-update/#bulk-updating
                deltaRowDataMode={true}
                pagination={false}
                onGridReady={this.onGridReady}
                rowData={inlineRowData}
                columnDefs={inlineColumnDefs}
                frameworkComponents={{
                  RendererCellRenderer,
                  EditorCellRenderer,
                  CustomLoadingOverlay,
                  CustomNoDataOverlay,
                  HeatmapCellRenderer,
                  ...frameworkComponents,
                }}
                defaultColDef={{
                  cellRenderer: 'RendererCellRenderer',
                  cellEditor: 'EditorCellRenderer',
                  enableCellChangeFlash: true,
                  ...defaultColDef,
                }}
                getRowNodeId={this.getRowNodeId}
                onCellValueChanged={this.onCellValueChanged}
                context={
                  (this.context = {
                    ...context,
                    unionId,
                    darkIfDoNotEditable,
                    inlineRowData,
                    rowData,
                    inlineColumnDefs,
                    columnDefs,
                    rowHeight,
                    rowKey,
                    vertical,
                    TableEventBus: this.TableEventBus,
                    getColumnIdByField: this.getColumnIdByField,
                    getRowNodeByRowIndex: this.getRowNodeByRowIndex,
                    getVerticalTableRowDataByColField: this.getVerticalTableRowDataByColField,
                    getVerticalTableRowIndexByColField: this.getVerticalTableRowIndexByColField,
                    getVerticalTableColDefByRowIndex: this.getVerticalTableColDefByRowIndex,
                  })
                }
                noRowsOverlayComponent={'CustomNoDataOverlay'}
                suppressLoadingOverlay={true}
                localeText={LOCAL_TEXT}
                suppressNoRowsOverlay={this.props.loading}
                rowClassRules={{
                  ...TableBase.defaultRowClassRules,
                  ...rowClassRules,
                }}
                tabToNextCell={this.tabToNextCell}
                getContextMenuItems={this.getContextMenuItems}
                onRangeSelectionChanged={this.onRangeSelectionChanged}
              />
            </div>
          </div>
        </div>
      </Loading>,
      this.props.pagination && (
        <Row style={{ marginTop: 15 }} type="flex" justify="end">
          <Pagination
            showQuickJumper={true}
            showTotal={(total, range) => `${range[0]} - ${range[1]} 共 ${total} 项`}
            showSizeChanger={true}
            // hideOnSinglePage
            {...this.props.pagination}
            {...this.props.paginationProps}
            onChange={this.onPaginationChange}
            onShowSizeChange={this.onPaginationShowSizeChange}
          />
        </Row>
      ),
    ];
  }

  private getToal = () => {
    if (!this.props.pagination) return null;
    return (this.props.pagination as ITablePagination).total;
  };
}

export default TableBase;
