import { Spin } from 'antd';
import classNames from 'classnames';
import { omit } from 'lodash';
import React, { PureComponent } from 'react';
import { ITableCellProps } from '../../type';
import { TABLE_CELL_VALUE_CHANGED } from '../constants/EVENT';
import EditingCell from './EditingCell';
import RenderingCell from './RenderingCell';
import styles from './SwitchCell.less';

class SwitchCell extends PureComponent<
  ITableCellProps,
  {
    editing: boolean;
    loading: boolean;
  }
> {
  public state = {
    editing: false,
    loading: false,
  };

  public $cell: HTMLTableDataCellElement;

  public $editingCell: EditingCell;

  public $renderingCell: RenderingCell;

  public componentDidMount = () => {
    const { record, getRowKey } = this.props;
    this.props.api.tableManager.registeCell(record[getRowKey()], this.getDataIndex(), this);
  };

  public getRowId = () => {
    const { record, getRowKey } = this.props;
    return record[getRowKey()];
  };

  public getRef = node => {
    this.$cell = node;
  };

  public getEditingCellRef = node => {
    this.$editingCell = node;
  };

  public getRenderingCellRef = node => {
    this.$renderingCell = node;
  };

  public onCellClick = () => {
    this.startEditing();
  };

  public startEditing = async () => {
    if (!this.getEditable()) return;
    if (!this.state.editing) {
      return this.setState({
        editing: !this.state.editing,
      });
    }
  };

  public saveCell = async () => {
    if (!this.getEditable()) return;
    if (this.state.editing) {
      const value = await this.$editingCell.getValue();
      this.mutableChangeRecordValue(value);
      this.setState({
        editing: false,
      });
    }
  };

  public mutableChangeRecordValue = value => {
    const { record } = this.props;
    const dataIndex = this.getDataIndex();
    const oldValue = record[dataIndex];

    if (oldValue === value) return;

    record[dataIndex] = value;
    this.triggerTableCellValueChanged(TABLE_CELL_VALUE_CHANGED, oldValue);
  };

  public triggerTableCellValueChanged = (eventName, oldValue) => {
    const { colDef, record, rowIndex, api } = this.props;
    const { dataIndex } = colDef;
    const { eventBus } = api;
    eventBus.emit(eventName, {
      record,
      dataIndex,
      rowIndex,
      oldValue,
    });
  };

  public getEditable = () => {
    const { colDef } = this.props;
    const { editable } = colDef;
    return editable;
  };

  public getDataIndex = () => {
    const { colDef } = this.props;
    const { dataIndex } = colDef;
    return dataIndex;
  };

  public getInlineCell = () => {
    const { colDef } = this.props;
    const { editable } = colDef;
    const { editing } = this.state;
    if (editable && editing) {
      return React.createElement(EditingCell, {
        ...this.props,
        ref: this.getEditingCellRef,
      });
    } else {
      return React.createElement(RenderingCell, {
        ...this.props,
        ref: this.getRenderingCellRef,
      });
    }
  };

  public onKeyDown = (e: KeyboardEvent) => {
    if (!this.getEditable()) return;

    // Enter
    if (e.keyCode === 13) {
      if (!this.state.editing) {
        this.startEditing();
        return;
      }
      this.saveCell();
      return;
    }

    // Tab
    if (e.keyCode === 9) {
      if (this.state.editing) {
        this.saveCell();
        setTimeout(() => {
          this.nextCellStartEditing();
        });
      }
      return;
    }
  };

  public nextCellStartEditing = () => {
    this._nextCellStartEditing(this.getRowId(), this.getDataIndex());
  };

  public _nextCellStartEditing = (rowId: string, colId: string) => {
    const cell = this.props.api.tableManager.getNextCell(rowId, colId);
    if (!cell) return;
    if (!cell.getEditable()) {
      return this._nextCellStartEditing(cell.getRowId(), cell.getDataIndex());
    }
    if (!cell.isEditing()) {
      return cell.startEditing();
    }
  };

  public isEditing = () => {
    return this.state.editing;
  };

  public onCellBlur = (e: FocusEvent) => {
    if (!this.getEditable()) return;
    if (this.state.editing) {
      this.saveCell();
    }
  };

  public render() {
    return (
      <td
        ref={this.getRef}
        {...omit(this.props, [
          'colDef',
          'record',
          'rowIndex',
          'trigger',
          'api',
          'context',
          'getRowKey',
        ])}
        onClick={this.onCellClick}
        onBlur={this.onCellBlur}
        onKeyDown={this.onKeyDown}
        className={classNames(styles.cell, {
          [styles.editable]: this.getEditable(),
          [styles.editing]: this.state.editing,
          [styles.rendering]: !this.state.editing,
        })}
      >
        <Spin spinning={this.state.loading}>{this.getInlineCell()}</Spin>
      </td>
    );
  }
}

export default SwitchCell;
