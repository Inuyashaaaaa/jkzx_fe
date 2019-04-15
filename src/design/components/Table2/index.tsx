import { Table } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { createEventBus, EVERY_EVENT_TYPE } from '../../utils';
import { ITableApi, ITableCellProps, ITableContext, ITableProps, ITableRowProps } from '../type';
import TableManager from './api';
import SwitchCell from './cells/SwitchCell';
import {
  TABLE_CELL_EDITING_CHANGED,
  TABLE_CELL_FIELDS_CHANGE,
  TABLE_CELL_VALUES_CHANGE,
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

  constructor(props) {
    super(props);
    const eventBus = createEventBus();
    eventBus.listen(EVERY_EVENT_TYPE, this.handleTableEvent);

    this.api = {
      eventBus,
      tableManager: new TableManager(),
    };

    this.context = this.getContext();
  }

  public componentDidMount = () => {
    window.addEventListener('click', this.onWindowClick, false);
  };

  public componentWillUnmount = () => {
    window.removeEventListener('click', this.onWindowClick, false);
  };

  public onWindowClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    this.save();
  };

  public getFieldNames = () => {
    return this.props.columns.map(item => item.dataIndex);
  };

  public validate = (options = {}, fieldNames = this.getFieldNames(), rowIds?) => {
    return this.api.tableManager.rowNodes
      .filter(item => rowIds == null || rowIds.findIndex(id => id === item.id))
      .forEach(item => {
        return item.node.validate(options, fieldNames);
      });
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
          return {
            ...(colDef.onCell ? colDef.onCell(record, rowIndex) : undefined),
            $$render: colDef.render,
            record,
            rowIndex,
            colDef,
            tableApi: this,
            size: this.convertInputSize(size),
            api: this.api,
            context: this.context,
            getRowKey,
            rowId: record[getRowKey()],
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
        setEditing: this.bindSetEditing(rowId),
        getEditing: this.bindGetEditing(rowId),
        editings: this.editings,
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
      this.editings[params.rowId] = true;
      return this.props.onCellFieldsChange && this.props.onCellFieldsChange(params);
    }
  };

  public bindSetEditing = rowId =>
    _.debounce(editing => {
      this.editings[rowId] = editing;
    }, 50);

  public bindGetEditing = rowId => () => {
    return this.editings[rowId];
  };

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
      <Table
        className={this.getClassName()}
        components={components}
        {...this.props}
        columns={this.getColumnDefs()}
        onRow={this.getOnRow()}
      />
    );
  }
}

export default Table2;
