import { Table } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import React, { PureComponent, KeyboardEvent } from 'react';
import { createEventBus, EVERY_EVENT_TYPE, uuid } from '../../utils';
import { ITableApi, ITableCellProps, ITableContext, ITableProps, ITableRowProps } from '../type';
import TableManager from './api';
import SwitchCell from './cells/SwitchCell';
import {
  TABLE_CELL_EDITING_CHANGED,
  TABLE_CELL_FIELDS_CHANGE,
  TABLE_CELL_VALUES_CHANGE,
  TABLE_KEY_DOWN,
} from './constants/EVENT';
import FormRow from './rows/FormRow';
import './styles.less';

class Table2 extends PureComponent<ITableProps> {
  public static defaultProps = {
    columns: [],
    rowKey: 'key',
    vertical: false,
    prefixCls: 'ant-table',
    size: 'default',
  };

  public api: ITableApi;

  public context: ITableContext = {};

  public editings: {} = {};

  public domId: string;

  public $dom: HTMLElement;

  constructor(props) {
    super(props);
    const eventBus = createEventBus();
    eventBus.listen(EVERY_EVENT_TYPE, this.handleTableEvent);
    this.domId = uuid();

    this.api = {
      eventBus,
      tableManager: new TableManager(),
    };

    this.context = this.getContext();
  }

  public getTbody = () => {
    return this.$dom.querySelector('.ant-table-tbody');
  };

  public getThead = () => {
    return this.$dom.querySelector('.ant-table-thead');
  };

  public componentDidMount = () => {
    this.$dom = document.getElementById(this.domId);
    this.getTbody().addEventListener('click', this.onTbodyClick, false);
    this.getThead().addEventListener('click', this.onTheadClick, false);
    window.addEventListener('keydown', this.onKeyDown, false);
  };

  public componentWillUnmount = () => {
    this.getTbody().removeEventListener('click', this.onTbodyClick, false);
    this.getThead().removeEventListener('click', this.onTheadClick, false);
    window.removeEventListener('keydown', this.onKeyDown, false);
  };

  public onTbodyClick = (event: Event) => {
    if (event.target === this.getTbody()) {
      this.save();
    }
  };

  public onTheadClick = (event: Event) => {
    this.save();
  };

  public onKeyDown = (event: Event) => {
    this.api.eventBus.emit(TABLE_KEY_DOWN, event);
  };

  public getFieldNames = () => {
    return this.props.columns.map(item => item.dataIndex);
  };

  public validate = (
    options = {},
    rowIds?: string[],
    colIds = this.getFieldNames()
  ): Promise<
    Array<{
      errors: any;
      values: any;
    }>
  > => {
    return Promise.all(
      this.api.tableManager.rowNodes
        .filter(item => rowIds == null || rowIds.findIndex(id => id === item.id))
        .map(item => {
          return item.node.validate(options, colIds);
        })
    );
  };

  public save = (rowIds?: string[], colIds?: string[]) => {
    return _.forEach(this.api.tableManager.cellNodes, (items, rowId) => {
      if (rowIds && rowIds.indexOf(rowId) === -1) return;
      items.forEach(item => {
        if (colIds && colIds.indexOf(item.id) === -1) return;
        item.node.saveCell();
      });
    });
  };

  public saveBy = (predicate: (rowId?: string, colId?: string) => boolean) => {
    return _.forEach(this.api.tableManager.cellNodes, (items, rowId) => {
      items.forEach(item => {
        if (predicate && predicate(rowId, item.id)) {
          item.node.saveCell();
        }
      });
    });
  };

  public getContext = (): ITableContext => {
    return {
      ...this.context,
    };
  };

  public convertInputSize = tableSize => {
    if (tableSize === 'default') {
      return 'large';
    }

    if (tableSize === 'middle') {
      return 'default';
    }

    return 'small';
  };

  public defaultRenderItem = val => val;

  public getColumnDefs = () => {
    const { size } = this.props;
    const columns = this.props.columns.map(colDef => {
      return {
        ...colDef,
        // colDef.render 会首先自己执行一次，因此将它挂在其他位置
        render: undefined,
        onCell: (record, rowIndex): ITableCellProps => {
          const getRowKey = () => {
            return typeof this.props.rowKey === 'string'
              ? this.props.rowKey
              : this.props.rowKey(record, rowIndex);
          };
          const rowId = record[getRowKey()];
          return {
            ...(colDef.onCell ? colDef.onCell(record, rowIndex, { colDef }) : undefined),
            $$render: colDef.render,
            record,
            rowIndex,
            colDef,
            tableApi: this,
            size: this.convertInputSize(size),
            api: this.api,
            context: this.context,
            getRowKey,
            rowId,
            // setEditing: this.bindSetEditing(rowId, colDef.dataIndex),
            // getEditing: this.bindGetEditing(rowId, colDef.dataIndex),
            // editings: this.editings,
          };
        },
      };
    });

    return columns;
  };

  public getOnRow = () => {
    return (record, rowIndex): ITableRowProps => {
      const getRowKey = () => {
        return typeof this.props.rowKey === 'string'
          ? this.props.rowKey
          : this.props.rowKey(record, rowIndex);
      };
      const rowKey = getRowKey();
      const rowId = record[rowKey];
      return {
        ...(this.props.onRow ? this.props.onRow(record, rowIndex) : undefined),
        api: this.api,
        record,
        rowId,
        rowIndex,
        context: this.context,
        getRowKey,
        columns: this.props.columns,
        // setEditing: this.bindSetEditing(rowId),
        // getEditing: this.bindGetEditing(rowId),
        // editings: this.editings,
        getContextMenu: this.props.getContextMenu,
      };
    };
  };

  public handleTableEvent = (params, eventName) => {
    if (eventName === TABLE_CELL_EDITING_CHANGED) {
      return this.props.onCellEditingChanged && this.props.onCellEditingChanged(params);
    }
    if (eventName === TABLE_CELL_VALUES_CHANGE) {
      return this.props.onCellValuesChange && this.props.onCellValuesChange(params);
    }
    if (eventName === TABLE_CELL_FIELDS_CHANGE) {
      // const { changedFields } = params;
      // Object.keys(changedFields).forEach(key => {
      //   _.set(this.editings, [params.rowId, key], true);
      // });
      return this.props.onCellFieldsChange && this.props.onCellFieldsChange(params);
    }
  };

  // public bindSetEditing = (rowId, colId) =>
  //   _.debounce(editing => {
  //     _.set(this.editings, [rowId, colId], editing);
  //   }, 50);

  // public bindGetEditing = (rowId, colId) => () => {
  //   return _.get(this.editings, [rowId, colId]);
  // };

  public listen = (eventName: string, callback, scope) => {
    this.api.eventBus.listen(eventName, callback, scope);
  };

  public unlisten = (eventName: string, callback) => {
    this.api.eventBus.unListen(eventName, callback);
  };

  public getClassName = () => {
    const { prefixCls, className, vertical } = this.props;
    return classNames(className, {
      [`${prefixCls}-vertical`]: vertical,
    });
  };

  public render() {
    const components = {
      body: {
        row: FormRow,
        cell: SwitchCell,
      },
    };
    return (
      <div id={this.domId}>
        <Table
          className={this.getClassName()}
          components={components}
          {...this.props}
          columns={this.getColumnDefs()}
          onRow={this.getOnRow()}
        />
      </div>
    );
  }
}

export default Table2;
