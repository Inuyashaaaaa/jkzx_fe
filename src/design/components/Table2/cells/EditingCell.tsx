import { WrappedFormUtils } from 'antd/lib/form/Form';
import { PureComponent } from 'react';
import { ITableCellProps } from '../../type';

class EditingCell extends PureComponent<ITableCellProps, any> {
  public $input: HTMLInputElement;

  public form: WrappedFormUtils;

  public getValue = async () => {
    const dataIndex = this.getDataIndex();
    const value = this.props.form.getFieldValue(dataIndex);
    const oldValue = this.props.cellApi.getValue();

    if (this.props.form.isFieldValidating(dataIndex)) {
      return oldValue;
    }

    if (oldValue === value) {
      return oldValue;
    }

    return value;
  };

  public getDataIndex = () => {
    const { colDef } = this.props;
    const { dataIndex } = colDef;
    return dataIndex;
  };

  public render() {
    const { record, rowIndex, children, $$render, colDef, cellApi } = this.props;
    const value = this.props.cellApi.getValue();
    return $$render
      ? cellApi.renderElement(
          $$render(value, record, rowIndex, {
            form: this.props.form,
            editing: true,
            colDef,
          })
        )
      : children;
  }
}

export default EditingCell;
