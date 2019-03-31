import { Spin } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import classNames from 'classnames';
import { omit } from 'lodash';
import React, { PureComponent } from 'react';
import { IFormCellProps, IFormTriggerCellValueChangeParams } from 'src/components/type';
import { FORM_CELL_VALUE_CHANGE, FORM_CELL_VALUE_CHANGED } from '../constants';
import EditingCell from './EditingCell';
import RenderingCell from './RenderingCell';
import styles from './SwitchCell.less';

class SwitchCell extends PureComponent<
  IFormCellProps,
  {
    editing: boolean;
    loading: boolean;
  }
> {
  public state = {
    editing: false,
    loading: false,
  };

  public $cell: HTMLDivElement;

  public $editingCell: EditingCell;

  public $renderingCell: RenderingCell;

  public componentDidMount = () => {
    this.registeCell();

    if (!this.props.form.isFieldTouched(this.getDataIndex())) {
      this.props.form.validateFields();
    }
    this.props.api.eventBus.listen(FORM_CELL_VALUE_CHANGE, this.onTableCellValueChange);
  };

  public componentWillUnmount = () => {
    this.props.api.eventBus.unListen(FORM_CELL_VALUE_CHANGE, this.onTableCellValueChange);
  };

  public startLoading = (callback?) => {
    this.setState({ loading: true }, callback);
  };

  public stopLoading = (callback?) => {
    this.setState({ loading: false }, callback);
  };

  public onTableCellValueChange = (params: IFormTriggerCellValueChangeParams) => {
    const dataIndex = this.getDataIndex();
    if (Object.keys(params.changedValues).indexOf(dataIndex) !== -1) return;

    // validate after rendered
    setTimeout(() => {
      this.validateRowForm({ force: true });
    }, 0);
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

  public onCellBlur = (e: FocusEvent) => {
    if (!this.getEditable()) return;
    if (this.state.editing) {
      this.saveCell();
    }
  };

  public saveCell = async (callback?) => {
    if (!this.getEditable()) return;
    if (!this.state.editing) return;
    const dataIndex = this.getDataIndex();
    if (this.props.form.isFieldValidating(dataIndex)) return;

    const { record } = this.props;
    if (record[dataIndex] === this.props.form.getFieldValue(dataIndex)) {
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

  public getDataIndex = () => {
    const { colDef } = this.props;
    const { dataIndex } = colDef;
    return dataIndex;
  };

  public validateRowForm = async (options = {}) => {
    return new Promise<{ error: boolean; values: any }>((resolve, reject) => {
      return this.props.form.validateFields(options, (error, values) => {
        resolve({ error, values });
      });
    });
  };

  public mutableChangeRecordValue = (value, linkage) => {
    const { record } = this.props;
    const dataIndex = this.getDataIndex();
    const oldValue = record[dataIndex];

    if (oldValue === value) return;

    record[dataIndex] = value;

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
      >
        <Spin spinning={this.state.loading}>{this.getInlineCell()}</Spin>
      </div>
    );
  }
}

export default SwitchCell;
