import { Table } from 'antd';
import React, { PureComponent } from 'react';
import { createEventBus } from '../../utils';
import { defaultInputManager } from '../Input';
import {
  ITableApi,
  ITableCellProps,
  ITableContext,
  ITableProps,
  ITableRowProps,
  ITableTriggerCellValueChangedParams,
} from '../type';
import TableManager from './api';
import SwitchCell from './cells/SwitchCell';
import { TABLE_CELL_VALUE_CHANGED } from './constants/EVENT';
import FormRow from './rows/FormRow';

class Table2 extends PureComponent<ITableProps> {
  public static defaultProps = {
    columns: [],
    rowKey: 'key',
    inputManager: defaultInputManager,
  };

  public api: ITableApi;

  public context: ITableContext = {};

  constructor(props) {
    super(props);
    const eventBus = createEventBus();
    eventBus.listen('.*', this.handleTableEvent);

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

  public getColumnDefs = () => {
    const columns = this.props.columns.map(colDef => {
      const { field } = colDef;
      return {
        ...colDef,
        onCell: (record, rowIndex): ITableCellProps => ({
          ...(colDef.onCell ? colDef.onCell(record, rowIndex) : undefined),
          record,
          rowIndex,
          colDef: {
            ...colDef,
            field: {
              hasFeedback: true,
              ...field,
            },
          },
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
      const {
        oldValue,
        record,
        rowIndex,
        dataIndex,
      } = params as ITableTriggerCellValueChangedParams;
      this.props.onCellValueChanged({
        record,
        rowIndex,
        dataIndex,
        value: record[dataIndex],
        oldValue,
      });
    }
  };

  public listen = (eventName: string, callback, scope) => {
    this.api.eventBus.listen(eventName, callback, scope);
  };

  public unlisten = (eventName: string, callback) => {
    this.api.eventBus.unListen(eventName, callback);
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
        components={components}
        {...this.props}
        columns={this.getColumnDefs()}
        onRow={this.getOnRow()}
      />
    );
  }
}

export default Table2;
