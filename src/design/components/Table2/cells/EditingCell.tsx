import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { PureComponent } from 'react';
import { ITableCellProps } from '../../type';
import { EditableContext } from '../rows/FormRow';

const FormItem = Form.Item;

class EditingCell extends PureComponent<ITableCellProps, any> {
  public $input: HTMLInputElement;

  public form: WrappedFormUtils;

  public getValue = async () => {
    const dataIndex = this.getDataIndex();
    const value = this.form.getFieldValue(dataIndex);
    const { record } = this.props;
    const oldValue = record[dataIndex];

    if (this.form.isFieldValidating(dataIndex)) {
      return oldValue;
    }

    if (oldValue === value) {
      return oldValue;
    }

    const { error } = await this.validateCell();

    return error ? oldValue : value;
  };

  public validateCell = async () => {
    return new Promise<{ error: boolean; values: any }>((resolve, reject) => {
      this.form.validateFields((error, values) => {
        resolve({ error, values });
      });
    });
  };

  public getDataIndex = () => {
    const { colDef } = this.props;
    const { dataIndex } = colDef;
    return dataIndex;
  };

  public render() {
    const { colDef, record, rowIndex, api } = this.props;
    const { dataIndex, decorator, render } = colDef;
    const value = record[dataIndex];
    const { input, field } = colDef;

    if (render) {
      return render(value, record, rowIndex);
    }

    if (input) {
      const Input = api.inputManager.getInput(input.type);
      return (
        <EditableContext.Consumer>
          {({ form }) => {
            this.form = form;
            return (
              <FormItem style={{ margin: 0 }} {...field}>
                {form.getFieldDecorator(dataIndex, {
                  ...decorator,
                  initialValue: record[dataIndex],
                })(<Input status="editing" autoSelect={true} {...input} />)}
              </FormItem>
            );
          }}
        </EditableContext.Consumer>
      );
    }

    return value;
  }
}

export default EditingCell;
