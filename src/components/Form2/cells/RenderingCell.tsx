import { PureComponent } from 'react';
import { EMPTY_VALUE } from '../../../containers/constants';
import { IFormCellProps } from '../../type';

class RenderingCell extends PureComponent<IFormCellProps> {
  public cn;

  public renderDiff = () => {
    const newVal = this.getValue();
    if (this.props.cellApi.oldValue !== EMPTY_VALUE && this.props.cellApi.oldValue !== newVal) {
      setTimeout(() => {
        if (this.props.cellApi.$cell) {
          this.props.cellApi.$cell.classList.add('tongyu-form-cell-diff');
        }

        if (this.cn) {
          clearTimeout(this.cn);
          this.cn = null;
        }
        this.cn = setTimeout(() => {
          this.cn = null;
          if (this.props.cellApi.$cell) {
            this.props.cellApi.$cell.classList.remove('tongyu-form-cell-diff');
          }
        }, 500);
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
