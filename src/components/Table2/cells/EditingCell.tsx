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

  public getRenderParams = () => {
    const { record, rowIndex, colDef, cellApi, api, context } = this.props;
    const value = this.props.cellApi.getValue();

    const inject = {
      form: this.props.form,
      editing: true,
      colDef,
      api,
      cellApi,
      context,
    };

    if ('dataIndex' in colDef) {
      return [value, record, rowIndex, inject];
    }
    return [record, record, rowIndex, inject];
  };

  public render() {
    const { children, $$render, cellApi } = this.props;

    return $$render
      ? cellApi.renderElement($$render.apply(this, this.getRenderParams()))
      : children;
  }
}

export default EditingCell;
