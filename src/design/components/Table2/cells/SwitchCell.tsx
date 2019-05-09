import { isShallowEqual } from '@/design/utils';
import { FormItemProps } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import classNames from 'classnames';
import _, { omit } from 'lodash';
import React, { KeyboardEvent, PureComponent, CSSProperties } from 'react';
import { EMPTY_VALUE } from '../../constants';
import Form2 from '../../Form2';
import { ITableCellProps } from '../../type';
import { wrapFormGetDecorator } from '../../utils';
import {
  TABLE_CELL_EDITING_CHANGED,
  TABLE_KEY_DOWN,
  TABLE_STOP_ACTIVE,
  TABLE_ARROW_KEY_CODE_OPTIONS,
  TABLE_ARROW_KEY_CODE_MAP,
} from '../constants/EVENT';
import { EditableContext } from '../rows/FormRow';
import EditingCell from './EditingCell';
import RenderingCell from './RenderingCell';

const getEditable = (editable, colDef, record, rowIndex) => {
  return typeof editable === 'function' ? editable(record, rowIndex, { colDef }) : editable;
};

class SwitchCell extends PureComponent<
  ITableCellProps,
  {
    editing: boolean;
    editable: boolean;
    editableChanged: boolean;
    active: boolean;
  }
> {
  public static defaultProps = {
    colDef: {},
    record: {},
  };

  public static getDerivedStateFromProps = (props, state) => {
    const { record, rowIndex, colDef } = props;
    const editable = getEditable(props.colDef.editable, colDef, record, rowIndex);
    const editableChanged = editable !== state.editable;

    const defaultEditing =
      typeof colDef.defaultEditing === 'function'
        ? colDef.defaultEditing(record, rowIndex)
        : colDef.defaultEditing;

    return {
      editableChanged,
      editable,
      editing: editableChanged
        ? defaultEditing == null
          ? !editable
          : defaultEditing
        : state.editing,
    };
  };

  public oldValue: any = EMPTY_VALUE;

  public $cell: HTMLTableDataCellElement;

  public $editingCell: EditingCell;

  public $renderingCell: RenderingCell;

  public form: WrappedFormUtils;

  public constructor(props) {
    super(props);
    this.state = {
      editing: null,
      editable: null,
      editableChanged: null,
      active: false,
    };
  }

  public componentDidMount = () => {
    this.registeCell();
    this.props.api.eventBus.listen(TABLE_KEY_DOWN, this.onTableKeyDown);
    this.props.api.eventBus.listen(TABLE_STOP_ACTIVE, this.onStopActive);
  };

  public componentWillUnmount = () => {
    this.deleteCell();
    this.props.api.eventBus.unListen(TABLE_KEY_DOWN, this.onTableKeyDown);
    this.props.api.eventBus.unListen(TABLE_STOP_ACTIVE, this.onStopActive);
  };

  public valueHasChanged = () => {
    const newVal = this.getValue();
    return this.oldValue !== EMPTY_VALUE && this.oldValue !== newVal;
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

  public deleteCell = () => {
    if (this.isSelectionCell()) {
      return;
    }

    const { record, getRowKey, api } = this.props;
    api.tableManager.deleteCell(record[getRowKey()], this.getDataIndex());
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
    this.props.tableApi.saveBy((rowId, colId) => {
      if (rowId === this.props.rowId && colId === this.props.colDef.dataIndex) {
        return false;
      }
      return true;
    });
    this.startEditing();
  };

  public getEditing = () => {
    return _.get(this.props.colDef, 'editing', this.state.editing);
  };

  public startEditing = async () => {
    if (!this.getEditable()) return;
    if (!this.getEditing()) {
      return this.setState(
        {
          editing: true,
        },
        () => {
          this.setAcitve();
        }
      );
    }
  };

  public saveCell = async (callback?) => {
    if (!this.getEditable()) return;
    if (!this.getEditing()) return;

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
    if (Form2.isField(val)) {
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

  public getEditable = (editable = this.props.colDef.editable) => {
    const { colDef, record, rowIndex } = this.props;
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
    const editing = this.getEditing();
    const wrapedForm = wrapFormGetDecorator(dataIndex, form);
    if (editing) {
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

  public onTableKeyDown = (e: KeyboardEvent) => {
    // Tab
    if (e.keyCode === 9) {
      this.handleTabTableKeyDown();
    }
    // Enter
    if (e.keyCode === 13) {
      this.handleEnterTableKeyDown();
    }
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      this.handleDirectionTableKeyDown(e.keyCode);
    }
  };

  public handleDirectionTableKeyDown = directionCode => {
    if (!this.getActive()) return;
    if (!this.getEditable()) return;
    if (this.getEditing()) return;

    // setState 的队列执行优先级大于 window.addEventListener，会导致一直 moveNext
    setTimeout(() => {
      this.moveNextCell(directionCode);
    });
  };

  public handleEnterTableKeyDown = () => {
    if (!this.getActive()) return;
    if (!this.getEditable()) return;

    if (!this.getEditing()) {
      this.startEditing();
      return;
    }
    // 不在编辑状态，但是处在active状态
    setTimeout(() => {
      this.saveCell();
    });
  };

  public handleTabTableKeyDown = () => {
    if (!this.getActive()) return;
    if (!this.getEditable()) return;
    if (this.getEditing()) {
      this.saveCell(() => {
        setTimeout(() => {
          this.nextCellStartEditing(TABLE_ARROW_KEY_CODE_MAP.NEXT);
        });
      });
      return;
    }
    // 不在编辑状态，但是处在active状态
    this.nextCellStartEditing(TABLE_ARROW_KEY_CODE_MAP.NEXT);
  };

  public onStopActive = self => {
    if (self === this) return;
    this.setState({
      active: false,
    });
  };

  public setAcitve = () => {
    this.props.api.eventBus.emit(TABLE_STOP_ACTIVE, this);
    this.setState({
      active: true,
    });
  };

  public getActive = () => {
    return this.state.active;
  };

  public _getNextCell = (rowId: string, colId: string, directionCode: number) => {
    const cell = this.getNextCellInstance(rowId, colId, directionCode);
    if (!cell) return null;
    if (!cell.getEditable()) {
      return this._getNextCell(cell.getRowId(), cell.getDataIndex(), directionCode);
    }
    return cell;
  };

  public getNextCell = directionCode => {
    return this._getNextCell(this.getRowId(), this.getDataIndex(), directionCode);
  };

  public nextCellStartEditing = directionCode => {
    const nextCell = this.getNextCell(directionCode);
    if (nextCell && !nextCell.isEditing()) {
      return nextCell.startEditing();
    }
  };

  public moveNextCell = directionCode => {
    const nextCell = this.getNextCell(directionCode);
    if (nextCell) {
      return nextCell.setAcitve();
    }
  };

  public getNextCellInstance = (rowId: string, colId: string, directionCode: number) => {
    if (directionCode === TABLE_ARROW_KEY_CODE_MAP.NEXT) {
      return this.props.api.tableManager.getNextCell(rowId, colId);
    }

    if (directionCode === TABLE_ARROW_KEY_CODE_MAP.DOWN) {
      return this.props.api.tableManager.getDownCell(rowId, colId);
    }

    if (directionCode === TABLE_ARROW_KEY_CODE_MAP.UP) {
      return this.props.api.tableManager.getUpCell(rowId, colId);
    }

    if (directionCode === TABLE_ARROW_KEY_CODE_MAP.LEFT) {
      return this.props.api.tableManager.getLeftCell(rowId, colId);
    }

    if (directionCode === TABLE_ARROW_KEY_CODE_MAP.RIGHT) {
      return this.props.api.tableManager.getRightCell(rowId, colId);
    }
  };

  public isEditing = () => {
    return !!this.getEditing();
  };

  public onCellBlur = event => {
    if (!this.getEditable()) return;
    if (this.getEditing()) {
      this.saveCell();
    }
  };

  public getTdStyle = (): CSSProperties => {
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
        className={classNames('tongyu-cell', 'tongyu-table-cell', {
          editable: this.getEditable(),
          editing: this.getEditing(),
          rendering: !this.getEditing(),
          active: this.getActive(),
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
