import { PureComponent } from 'react';
import { IFormCellProps } from '../../type';

class RenderingCell extends PureComponent<IFormCellProps> {
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

  public getValue = () => {
    return this.props.cellApi.getValue();
  };

  public getDataIndex = () => {
    const { colDef } = this.props;
    const { dataIndex } = colDef;
    return dataIndex;
  };

  public render() {
    this.renderDiff();

    const { form, record, colDef, cellApi } = this.props;
    const { render } = colDef;
    const value = cellApi.getValue();
    if (render) {
      return cellApi.renderElement(
        render(value, record, 0, {
          form,
          editing: false,
          colDef,
        })
      );
    }
    return value || null;
  }
}

export default RenderingCell;
