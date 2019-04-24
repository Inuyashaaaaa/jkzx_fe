import { FormItemProps } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import classNames from 'classnames';
import _, { omit } from 'lodash';
import React, { KeyboardEvent, PureComponent } from 'react';
import { EMPTY_VALUE } from '../../constants';
import { IFormCellProps } from '../../type';
import { wrapFormGetDecorator } from '../../utils';
import { FORM_CELL_EDITING_CHANGED } from '../constants';
import EditingCell from './EditingCell';
import RenderingCell from './RenderingCell';
import './SwitchCell.less';

class SwitchCell extends PureComponent<
  IFormCellProps,
  {
    editing: boolean;
  }
> {
  public static defaultProps = {
    prefix: 'tongyu',
  };

  public oldValue: any = EMPTY_VALUE;

  public $cell: HTMLDivElement;

  public $editingCell: EditingCell;

  public $renderingCell: RenderingCell;

  public constructor(props) {
    super(props);
    this.state = {
      editing: _.get(props.colDef, 'defaultEditing', !props.colDef.editable),
    };
  }

  public componentDidMount = () => {
    this.registeCell();
  };

  public registeCell = () => {
    const { api } = this.props;
    api.formManager.registeCell(this.getDataIndex(), this);
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

  public getInlineCell = () => {
    const { colDef, form } = this.props;
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

  public renderElement = elements => {
    const { colDef, api } = this.props;
    const { title } = colDef;
    return React.Children.toArray(elements).map(element => {
      if (!React.isValidElement<FormItemProps & React.ReactNode>(element)) return element;

      return React.cloneElement(element, {
        ...(element.type === (FormItem.default || FormItem)
          ? {
              label: title,
            }
          : {}),
        ...api.getFormItemLayout(),
        ...element.props,
        children: _.get(element, 'props.children', false)
          ? this.renderElement(element.props.children)
          : undefined,
      });
    });
  };

  public getEditing = () => {
    return _.get(this.props.colDef, 'editing', this.state.editing);
  };

  public startEditing = async () => {
    if (!this.getEditable()) return;
    if (!this.getEditing()) {
      return this.setState({
        editing: !this.getEditing(),
      });
    }
  };

  public getEditable = () => {
    const { colDef } = this.props;
    const { editable } = colDef;
    return editable;
  };

  public onCellClick = event => {
    event.stopPropagation();
    this.props.api.save(
      _.reject(
        this.props.api.getColumnDefs().map(item => item.dataIndex),
        item => item === this.props.colDef.dataIndex
      )
    );
    this.startEditing();
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

  public saveCell = async (callback?) => {
    if (!this.getEditable()) return;
    if (!this.getEditing()) return;
    const dataIndex = this.getDataIndex();
    if (this.props.form.isFieldValidating(dataIndex)) return;

    const errorMsgs = await this.props.form.getFieldError(dataIndex);
    if (errorMsgs) return;
    if (this.$editingCell) {
      const value = await this.$editingCell.getValue();
      this.switchCellEditingStatus(value);
      this.setState({ editing: false }, callback);
    }
  };

  public getDataIndex = () => {
    const { colDef } = this.props;
    const { dataIndex } = colDef;
    return dataIndex;
  };

  public switchCellEditingStatus = value => {
    this.triggerTableCellValueChanged(value);
  };

  public triggerTableCellValueChanged = value => {
    const { colDef, record, api } = this.props;
    const { dataIndex } = colDef;
    api.eventBus.emit(FORM_CELL_EDITING_CHANGED, {
      value,
      record,
      dataIndex,
    });
  };

  public onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!this.getEditable()) return;

    // Enter
    if (e.keyCode === 13) {
      if (!this.getEditing()) {
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
      if (this.getEditing()) {
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
    this._nextCellStartEditing(this.getDataIndex());
  };

  public _nextCellStartEditing = (colId: string) => {
    const cell = this.props.api.formManager.getNextCell(colId);
    if (!cell) return;
    if (!cell.getEditable()) {
      return this._nextCellStartEditing(cell.getDataIndex());
    }
    if (!cell.isEditing()) {
      return cell.startEditing();
    }
  };

  public isEditing = () => {
    return !!this.getEditing();
  };

  public render() {
    return (
      <div
        ref={this.getRef}
        {...omit(this.props, [
          'prefix',
          'form',
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
        onKeyDown={this.onKeyDown}
        className={classNames(`${this.props.prefix}-cell`, `${this.props.prefix}-form-cell`, {
          editable: this.getEditable(),
          editing: this.getEditing(),
          rendering: !this.getEditing(),
        })}
      >
        {this.getInlineCell()}
      </div>
    );
  }
}

export default SwitchCell;
