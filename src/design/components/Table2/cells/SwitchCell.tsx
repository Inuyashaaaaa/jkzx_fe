import { FormItemProps } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import classNames from 'classnames';
import _, { omit } from 'lodash';
import React, { KeyboardEvent, PureComponent } from 'react';
import { EMPTY_VALUE } from '../../constants';
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
  }
> {
  public static defaultProps = {
    colDef: {},
    record: {},
  };

  public state = {
    editing: false,
  };

  public oldValue: any = EMPTY_VALUE;

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

  public renderElement = elements => {
    return React.Children.toArray(elements).map((element, index) => {
      if (!React.isValidElement<FormItemProps & React.ReactNode>(element)) return element;
      return React.cloneElement(element, {
        key: index,
        ...(element.type === (FormItem.default || FormItem)
          ? {
              label: '',
            }
          : {}),
        ...element.props,
        children: _.get(element, 'props.children', false)
          ? this.renderElement(element.props.children)
          : undefined,
      });
    });
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

  public onCellClick = event => {
    event.stopPropagation();
    this.props.tableApi.save(
      null,
      _.reject(
        this.props.tableApi.getColumnDefs().map(item => item.dataIndex),
        item => item === this.props.colDef.dataIndex
      )
    );
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

  public cellValueIsField = () => {
    const { record } = this.props;
    const dataIndex = this.getDataIndex();
    const val = record[dataIndex];
    return typeof val === 'object' && val.type === 'field';
  };

  public getCellValue = () => {
    const { record } = this.props;
    const dataIndex = this.getDataIndex();
    const val = record[dataIndex];
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
    const { colDef, record, rowIndex } = this.props;
    const { editable } = colDef;
    return typeof editable === 'function' ? editable(record, rowIndex, { colDef }) : editable;
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
        colDef,
      });
    } else {
      return React.createElement(RenderingCell, {
        ...this.props,
        cellApi: this,
        form: wrapedForm,
        ref: this.getRenderingCellRef,
        colDef,
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
      setTimeout(() => {
        this.saveCell();
      });
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

  public onCellBlur = event => {
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
          'tableApi',
          'rowId',
        ])}
        onClick={this.onCellClick}
        onKeyDown={this.onKeyDown}
        className={classNames('tongyu-cell', {
          editable: this.getEditable(),
          editing: this.state.editing,
          rendering: !this.state.editing,
        })}
        style={this.getTdStyle()}
      >
        <EditableContext.Consumer>
          {({ form }) => {
            this.form = form;
            return this.getInlineCell(form);
          }}
        </EditableContext.Consumer>
      </td>
    );
  }
}

export default SwitchCell;
