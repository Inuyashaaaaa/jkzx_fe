import { PureComponent } from 'react';
import { IFormCellProps } from '../../../type';

class EditingCell extends PureComponent<IFormCellProps, any> {
  public getValue = async () => {
    const dataIndex = this.getDataIndex();
    const value = this.props.form.getFieldValue(dataIndex);
    const { record } = this.props;
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
    const { form, record, colDef, cellApi } = this.props;
    const { render } = colDef;
    const value = cellApi.getValue();
    if (render) {
      return cellApi.renderElement(
        render(value, record, 0, {
          form,
          editing: true,
          colDef,
        })
      );
    }

    return value;
  }
}

export default EditingCell;
