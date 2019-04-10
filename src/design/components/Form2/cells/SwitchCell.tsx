import { Spin } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import classNames from 'classnames';
import { omit } from 'lodash';
import React, { FocusEvent, KeyboardEvent, PureComponent } from 'react';
import { IFormCellProps } from '../../type';
import { wrapFormGetDecorator } from '../../utils';
import { FORM_CELL_VALUE_CHANGED } from '../constants';
import EditingCell from './EditingCell';
import RenderingCell from './RenderingCell';
import './SwitchCell.less';

class SwitchCell extends PureComponent<
  IFormCellProps,
  {
    editing: boolean;
    loading: boolean;
  }
> {
  public static defaultProps = {
    prefix: 'form2-switch',
  };

  public state = {
    editing: false,
    loading: false,
  };

  public $cell: HTMLDivElement;

  public $editingCell: EditingCell;

  public $renderingCell: RenderingCell;

  constructor(props) {
    super(props);
  }

  public componentDidMount = () => {
    this.registeCell();
  };

  public startLoading = (callback?) => {
    this.setState({ loading: true }, callback);
  };

  public stopLoading = (callback?) => {
    this.setState({ loading: false }, callback);
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

  public renderElement = element => {
    const { colDef, api } = this.props;
    const { title } = colDef;

    if (React.isValidElement<FormItemProps>(element) && element.type === FormItem) {
      return React.cloneElement(element, {
        label: title,
        ...api.getFormItemLayout(),
        ...element.props,
      });
    }

    return element;
  };

  public startEditing = async () => {
    if (!this.getEditable()) return;
    if (!this.state.editing) {
      return this.setState({
        editing: !this.state.editing,
      });
    }
  };

  public getEditable = () => {
    const { colDef } = this.props;
    const { editable } = colDef;
    return editable;
  };

  public onCellClick = () => {
    this.startEditing();
  };

  public onCellBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!this.getEditable()) return;
    if (this.state.editing) {
      this.saveCell();
    }
  };

  public getValue = () => {
    const { record } = this.props;
    const dataIndex = this.getDataIndex();
    const val = record[dataIndex];
    if (val != null && typeof val === 'object') {
      return val.value;
    }
    return val;
  };

  public setValue = newVal => {
    const { record } = this.props;
    const dataIndex = this.getDataIndex();
    const val = record[dataIndex];
    if (typeof val === 'object' && val.value) {
      val.value = newVal;
    }
    record[dataIndex] = newVal;
  };

  public saveCell = async (callback?) => {
    if (!this.getEditable()) return;
    if (!this.state.editing) return;
    const dataIndex = this.getDataIndex();
    if (this.props.form.isFieldValidating(dataIndex)) return;

    const { record } = this.props;
    if (this.getValue() === this.props.form.getFieldValue(dataIndex)) {
      return this.setState({ editing: false }, callback);
    }

    const errorMsgs = await this.props.form.getFieldError(dataIndex);
    if (errorMsgs) return;
    if (this.$editingCell) {
      const value = await this.$editingCell.getValue();
      this.mutableChangeRecordValue(value, false);
      this.setState({ editing: false }, callback);
    }
  };

  public getDataIndex = () => {
    const { colDef } = this.props;
    const { dataIndex } = colDef;
    return dataIndex;
  };

  public mutableChangeRecordValue = (value, linkage) => {
    const { record } = this.props;
    const dataIndex = this.getDataIndex();
    const oldValue = this.getValue();

    if (oldValue === value) return;

    this.setValue(value);

    this.triggerTableCellValueChanged(value, oldValue, linkage);
  };

  public triggerTableCellValueChanged = (value, oldValue, linkage) => {
    const { colDef, record, api } = this.props;
    const { dataIndex } = colDef;
    api.eventBus.emit(FORM_CELL_VALUE_CHANGED, {
      value,
      record,
      dataIndex,
      oldValue,
      linkage,
    });
  };

  public onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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
    return !!this.state.editing;
  };

  public render() {
    return (
      <div
        ref={this.getRef}
        {...omit(this.props, [
          'prefix',
          'getValue',
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
        onBlur={this.onCellBlur}
        onKeyDown={this.onKeyDown}
        className={classNames(`${this.props.prefix}-cell`, {
          editable: this.getEditable(),
          editing: this.state.editing,
          rendering: !this.state.editing,
        })}
      >
        <Spin spinning={this.state.loading}>{this.getInlineCell()}</Spin>
      </div>
    );
  }
}

export default SwitchCell;
