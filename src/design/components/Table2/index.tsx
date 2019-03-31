import { Table } from 'antd';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { createEventBus, EVERY_EVENT_TYPE } from '../../utils';
import { defaultInputManager } from '../Input';
import { ITableApi, ITableCellProps, ITableContext, ITableProps, ITableRowProps } from '../type';
import TableManager from './api';
import SwitchCell from './cells/SwitchCell';
import { TABLE_CELL_VALUE_CHANGE, TABLE_CELL_VALUE_CHANGED } from './constants/EVENT';
import FormRow from './rows/FormRow';
import './styles.less';

class Table2 extends PureComponent<ITableProps> {
  public static defaultProps = {
    columns: [],
    rowKey: 'key',
    inputManager: defaultInputManager,
    vertical: false,
    prefixCls: 'ant-table',
    size: 'default',
  };

  public api: ITableApi;

  public context: ITableContext = {};

  constructor(props) {
    super(props);
    const eventBus = createEventBus();
    eventBus.listen(EVERY_EVENT_TYPE, this.handleTableEvent);

    this.api = {
      eventBus,
      tableManager: new TableManager(),
      inputManager: props.inputManager,
    };

    this.context = this.getContext();
  }

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

  public normalizeGetValue = colGetValue => {
    const [value, ...depends] = Array.isArray(colGetValue) ? colGetValue : [colGetValue];
    return {
      value,
      depends,
    };
  };

  public getColumnDefs = () => {
    const { size } = this.props;
    const columns = this.props.columns.map(colDef => {
      return {
        ...colDef,
        // colDef.render 会首先自己执行一次，因此将它挂在其他位置
        render: undefined,
        onCell: (record, rowIndex): ITableCellProps => ({
          ...(colDef.onCell ? colDef.onCell(record, rowIndex) : undefined),
          $$render: colDef.render,
          getValue: this.normalizeGetValue(colDef.getValue),
          record,
          rowIndex,
          colDef,
          size: this.convertInputSize(size),
          api: this.api,
          context: this.context,
          getRowKey: () => {
            return typeof this.props.rowKey === 'string'
              ? this.props.rowKey
              : this.props.rowKey(record, rowIndex);
          },
        }),
      };
    });

    return columns;
  };

  public getOnRow = () => {
    return (record, rowIndex): ITableRowProps => {
      return {
        ...(this.props.onRow ? this.props.onRow(record, rowIndex) : undefined),
        api: this.api,
        record,
        rowIndex,
        context: this.context,
        getRowKey: () => {
          return typeof this.props.rowKey === 'string'
            ? this.props.rowKey
            : this.props.rowKey(record, rowIndex);
        },
      };
    };
  };

  public handleTableEvent = (params, eventName) => {
    if (eventName === TABLE_CELL_VALUE_CHANGED) {
      return this.props.onCellValueChanged && this.props.onCellValueChanged(params);
    }
    if (eventName === TABLE_CELL_VALUE_CHANGE) {
      return this.props.onCellValueChange && this.props.onCellValueChange(params);
    }
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
