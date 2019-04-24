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
    const { record, rowIndex, $$render, form } = this.props;
    const value = this.getValue();

    if (!$$render) return value;

    const node = $$render(value, record, rowIndex, {
      form,
      editing: false,
    });
    if (React.isValidElement(node)) {
      return React.cloneElement(node, {
        key: 'last',
      });
    }
    return node;
  };

  public render() {
    const { children } = this.props;
    return React.Children.toArray(children)
      .slice(0, -1)
      .concat(this.getRenderResult());
  }
}

export default RenderingCell;
