import { WrappedFormUtils } from 'antd/lib/form/Form';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { EMPTY_VALUE } from '../../../containers/constants';
import { ITableCellProps } from '../../type';

class RenderingCell extends PureComponent<ITableCellProps, any> {
  public $input: HTMLInputElement;

  public form: WrappedFormUtils;

  public cn;

  public renderDiff = () => {
    const newVal = this.getValue();
    if (this.props.cellApi.valueHasChanged()) {
      setTimeout(() => {
        if (this.props.cellApi.$cell) {
          this.props.cellApi.$cell.classList.add('tongyu-cell-diff');
        }

        if (this.cn) {
          clearTimeout(this.cn);
          this.cn = null;
        }
        this.cn = setTimeout(() => {
          this.cn = null;
          if (this.props.cellApi.$cell) {
            this.props.cellApi.$cell.classList.remove('tongyu-cell-diff');
          }
        }, 500);
      });
    }
    this.props.cellApi.oldValue = newVal;
  };

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

  public render() {
    this.renderDiff();

    const { children } = this.props;
    return React.Children.toArray(children)
      .slice(0, -1)
      .concat(this.getRenderResult());
  }
}

export default RenderingCell;
