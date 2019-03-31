import { Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import classNames from 'classnames';
import { omit } from 'lodash';
import React, { PureComponent } from 'react';
import { ITableCellProps, ITableTriggerCellValueChangeParams } from '../../type';
import { TABLE_CELL_VALUE_CHANGE, TABLE_CELL_VALUE_CHANGED } from '../constants/EVENT';
import { EditableContext } from '../rows/FormRow';
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
  public static defaultProps = {
    colDef: {},
    record: {},
  };

  public state = {
    editing: false,
    loading: false,
  };

  public $cell: HTMLTableDataCellElement;

  public $editingCell: EditingCell;

  public $renderingCell: RenderingCell;

  public form: WrappedFormUtils;

  public isSelectionCell = () => {
    return this.props.className === 'ant-table-selection-column';
  };

  public startLoading = (callback?) => {
    this.setState({ loading: true }, callback);
  };

  public stopLoading = (callback?) => {
    this.setState({ loading: false }, callback);
  };

  public registeCell = () => {
    if (this.isSelectionCell()) {
      return;
    }

    const { record, getRowKey, api } = this.props;
    api.tableManager.registeCell(record[getRowKey()], this.getDataIndex(), this);
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

  public validateRowForm = async (options = {}) => {
    return new Promise<{ error: boolean; values: any }>((resolve, reject) => {
      return this.form.validateFields(options, (error, values) => {
        resolve({ error, values });
      });
    });
  };

  public saveCell = async (callback?) => {
    if (!this.getEditable()) return;
    if (!this.state.editing) return;
    const dataIndex = this.getDataIndex();
    if (this.form.isFieldValidating(dataIndex)) return;

    const { record } = this.props;
    if (record[dataIndex] === this.form.getFieldValue(dataIndex)) {
      return this.setState({ editing: false }, callback);
    }

    const { error } = await this.validateRowForm();
    if (error) return;
    if (this.$editingCell) {
      const value = await this.$editingCell.getValue();
      this.mutableChangeRecordValue(value, false);
      this.setState({ editing: false }, callback);
    }
  };

  public mutableChangeRecordValue = (value, linkage) => {
    const { record } = this.props;
    const dataIndex = this.getDataIndex();
    const oldValue = record[dataIndex];

    if (oldValue === value) return;

    record[dataIndex] = value;

    this.triggerTableCellValueChanged(TABLE_CELL_VALUE_CHANGED, value, oldValue, linkage);
  };

  public triggerTableCellValueChanged = (eventName, value, oldValue, linkage) => {
    const { colDef, record, rowIndex, api, getRowKey } = this.props;
    const { dataIndex } = colDef;
    const { eventBus } = api;
    eventBus.emit(eventName, {
      linkage,
      value,
      record,
      dataIndex,
      rowIndex,
      oldValue,
      rowId: record[getRowKey()],
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

  public getInlineCell = form => {
    const { colDef } = this.props;
    const { editable } = colDef;
    const { editing } = this.state;
    if (editable && editing) {
      return React.createElement(EditingCell, {
        ...this.props,
        cellApi: this,
        form,
        ref: this.getEditingCellRef,
      });
    } else {
      return React.createElement(RenderingCell, {
        ...this.props,
        cellApi: this,
        form,
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
        this.saveCell(() => {
          setTimeout(() => {
            this.nextCellStartEditing();
          });
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
    return !!this.state.editing;
  };

  public onCellBlur = (e: FocusEvent) => {
    if (!this.getEditable()) return;
    if (this.state.editing) {
      this.saveCell();
    }
  };

  public getTdStyle = () => {
    const { style } = this.props;
    if (this.isSelectionCell()) {
      return {
        ...style,
        width: 'auto',
        textAlign: 'center',
      };
    }
    return style;
  };

  public onTableCellValueChange = (params: ITableTriggerCellValueChangeParams) => {
    const { rowId } = params;
    if (rowId !== this.getRowId()) return;

    const dataIndex = this.getDataIndex();
    if (Object.keys(params.changedValues).indexOf(dataIndex) !== -1) return;

    // validate after rendered
    setTimeout(() => {
      this.validateRowForm({ force: true });
    }, 0);
  };

  public componentDidMount = () => {
    this.registeCell();

    if (!this.form.isFieldTouched(this.getDataIndex())) {
      this.form.validateFields();
    }
    this.props.api.eventBus.listen(TABLE_CELL_VALUE_CHANGE, this.onTableCellValueChange);
  };

  public componentWillUnmount = () => {
    this.props.api.eventBus.unListen(TABLE_CELL_VALUE_CHANGE, this.onTableCellValueChange);
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
          '$$render',
        ])}
        onClick={this.onCellClick}
        onBlur={this.onCellBlur}
        onKeyDown={this.onKeyDown}
        className={classNames(styles.cell, {
          [styles.editable]: this.getEditable(),
          [styles.editing]: this.state.editing,
          [styles.rendering]: !this.state.editing,
        })}
        style={this.getTdStyle()}
      >
        <Spin spinning={this.state.loading}>
          <EditableContext.Consumer>
            {({ form }) => {
              this.form = form;
              return this.getInlineCell(form);
            }}
          </EditableContext.Consumer>
        </Spin>
      </td>
    );
  }
}

export default SwitchCell;
