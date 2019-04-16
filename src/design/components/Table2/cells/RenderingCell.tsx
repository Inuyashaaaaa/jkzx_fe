import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { PureComponent } from 'react';
import { ITableCellProps } from '../../type';

class RenderingCell extends PureComponent<ITableCellProps, any> {
  public $input: HTMLInputElement;

  public form: WrappedFormUtils;

  public getRowId = () => {
    const { record, getRowKey } = this.props;
    return record[getRowKey()];
  };

  public getDataIndex = () => {
    const { colDef } = this.props;
    const { dataIndex } = colDef;
    return dataIndex;
  };

  public getInputRef = node => {
    this.$input = node;
  };

  public getValue = () => {
    return this.props.cellApi.getValue();
  };

  public getRenderResult = () => {
    const { record, rowIndex, $$render, form, colDef, cellApi } = this.props;
    const value = this.getValue();

    if (!$$render) return value;

    const node = cellApi.renderElement(
      $$render(value, record, rowIndex, {
        form,
        editing: false,
        colDef,
      })
    );
    if (React.isValidElement(node)) {
      return React.cloneElement(node, {
        key: 'last',
      });
    }
    return node;
  };

  public renderDiff = () => {
    const newVal = this.getValue();
    if (this.props.cellApi.oldValue !== newVal) {
      setTimeout(() => {
        this.props.cellApi.$cell.classList.add('tongyu-table-cell-update');
        setTimeout(() => {
          this.props.cellApi.$cell.classList.remove('tongyu-table-cell-update');
        }, 1000);
      });
    }
    this.props.cellApi.oldValue = newVal;
  };

  public render() {
    this.renderDiff();

    const { children } = this.props;
    return React.Children.toArray(children)
      .slice(0, -1)
      .concat(this.getRenderResult());
  }
}

export default RenderingCell;
