import { Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import classNames from 'classnames';
import { omit } from 'lodash';
import React, { KeyboardEvent, PureComponent } from 'react';
import { ITableCellProps } from '../../type';
import { wrapFormGetDecorator } from '../../utils';
import { TABLE_CELL_EDITING_CHANGED } from '../constants/EVENT';
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

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.registeCell();
  };

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

  public saveCell = async (callback?) => {
    if (!this.getEditable()) return;
    if (!this.state.editing) return;
    const dataIndex = this.getDataIndex();
    if (this.form.isFieldValidating(dataIndex)) return;

    const errorMsgs = await this.form.getFieldError(dataIndex);
    if (errorMsgs) return;
    if (this.$editingCell) {
      const value = await this.$editingCell.getValue();
      this.switchCellEditingStatus(value);
      this.setState({ editing: false }, () => {
        if (callback) {
          callback();
        }
      });
    }
  };

  public getValue = () => {
    const { record } = this.props;
    const dataIndex = this.getDataIndex();
    const val = record[dataIndex];
    if (typeof val === 'object' && val.type === 'field') {
      return val.value;
    }
    return val;
  };

  public switchCellEditingStatus = value => {
    this.triggerTableCellValueChanged(TABLE_CELL_EDITING_CHANGED, value);
  };

  public triggerTableCellValueChanged = (eventName, value) => {
    const { colDef, record, rowIndex, api, getRowKey } = this.props;
    const { dataIndex } = colDef;
    const { eventBus } = api;
    eventBus.emit(eventName, {
      value,
      record,
      dataIndex,
      rowIndex,
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
    const { editable, dataIndex } = colDef;
    const { editing } = this.state;
    const wrapedForm = wrapFormGetDecorator(dataIndex, form);
    if (editable && editing) {
      return React.createElement(EditingCell, {
        ...this.props,
        cellApi: this,
        form: wrapedForm,
        ref: this.getEditingCellRef,
      });
    } else {
      return React.createElement(RenderingCell, {
        ...this.props,
        cellApi: this,
        form: wrapedForm,
        ref: this.getRenderingCellRef,
      });
    }
  };

  public onKeyDown = (e: KeyboardEvent<HTMLTableDataCellElement>) => {
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

  public onCellBlur = () => {
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
          'loading',
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
        <Spin spinning={this.props.loading}>
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
