import { WrappedFormUtils } from 'antd/lib/form/Form';
import React from 'react';
import StationalComponent from '../StationalComponent';
import WrappedForm2 from './FormBase';
import { Form2Props, FormState } from './types';

class Form extends StationalComponent<Form2Props, FormState> {
  public static defaultProps = {
    controls: [],
  };

  public $wrappedForm: WrappedFormUtils = null;

  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      dataSource:
        props.dataSource &&
        props.controls
          .map(item => item.field)
          .reduce((dataSource, field) => {
            // fill keys, setFieldsValue need to judge
            dataSource[field] = dataSource[field];
            return dataSource;
          }, props.dataSource),
    };
  }

  public validate = (): Promise<{ error: boolean; values?: any }> => {
    return new Promise((resolve, reject) => {
      this.$wrappedForm.validateFieldsAndScroll((error, values) => {
        resolve({ error, values });
      });
    });
  };

  public onValueChange = params => {
    if (!this.props.onValueChange) {
      return this.$setState({
        dataSource: params.values,
      });
    }
    return this.props.onValueChange({
      ...params,
      oldValues: this.getUsedStateField('dataSource'),
    });
  };

  public onFieldChange = params => {
    if (!this.props.onFieldChange) {
      return this.$setState({
        fields: {
          ...this.getUsedStateField('fields'),
          ...params.fields,
        },
      });
    }
    return this.props.onFieldChange(params);
  };

  public getRef = node => {
    this.$wrappedForm = node;
  };

  public render() {
    return (
      <WrappedForm2
        {...this.props}
        {...this.getUsedState()}
        ref={this.getRef}
        fields={this.state.fields}
        onValueChange={this.onValueChange}
        onFieldChange={this.onFieldChange}
      />
    );
  }
}

export default Form;
