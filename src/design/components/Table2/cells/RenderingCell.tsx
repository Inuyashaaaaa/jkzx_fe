import React, { PureComponent } from 'react';
import { ITableCellProps } from '../../type';

class RenderingCell extends PureComponent<ITableCellProps, any> {
  public $input: HTMLInputElement;

  public getInputRef = node => {
    this.$input = node;
  };

  public getValue = () => {
    const { colDef, record } = this.props;
    const { dataIndex } = colDef;
    return record[dataIndex];
  };

  public getRender = () => {
    const { colDef } = this.props;
    const { render } = colDef;
    return render;
  };

  public render() {
    const render = this.getRender();
    const value = this.getValue();
    const { record, rowIndex, colDef, api } = this.props;
    const { input } = colDef;

    if (render) {
      return render(value, record, rowIndex);
    }

    if (input) {
      const Input = api.inputManager.getInput(input.type);
      return <Input status="rendering" value={value} {...input} />;
    }

    return this.getValue();
  }
}

export default RenderingCell;
