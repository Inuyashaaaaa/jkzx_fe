import { Form as AntdForm } from 'antd';
import { FormCreateOption } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import _ from 'lodash';
import React, { ComponentClass, PureComponent } from 'react';
import { createEventBus } from '../../utils';
import { IFormBaseProps, IFormProps, IFormTriggerCellValueChangeParams } from '../type';
import { FORM_CELL_VALUE_CHANGE } from './constants';
import FormBase from './FormBase';

class Form extends PureComponent<IFormProps & FormCreateOption<IFormProps>> {
  public static defaultProps = {
    dataSource: {},
  };

  public static createOptionsFields = [
    'onFieldsChange',
    'onValuesChange',
    'mapPropsToFields',
    'validateMessages',
    'withRef',
    'name',
  ];

  public DecoratorForm: ComponentClass<IFormBaseProps>;

  public decoratorForm: WrappedFormUtils;

  public eventBus = createEventBus();

  constructor(props) {
    super(props);
    this.DecoratorForm = AntdForm.create<IFormBaseProps>({
      ..._.pick(props, Form.createOptionsFields),
      onFieldsChange: this.onFieldsChange,
    })(FormBase);
  }

  public onFieldsChange = (
    props: IFormProps & FormCreateOption<IFormProps>,
    changedFields,
    allFields
  ) => {
    const changedValues = _.mapValues(changedFields, val => val.value);
    const allValues = _.mapValues(allFields, val => val.value);
    const { dataSource: record } = props;
    const event: IFormTriggerCellValueChangeParams = {
      changedValues,
      allValues,
      record,
    };
    this.eventBus.emit(FORM_CELL_VALUE_CHANGE, event);
  };

  public validate = async (
    options = {},
    fieldNames = this.props.columns.map(item => item.dataIndex)
  ) => {
    return new Promise<{ error: boolean; values: any }>((resolve, reject) => {
      this.decoratorForm.validateFieldsAndScroll(fieldNames, options, (error, values) => {
        resolve({ error, values });
      });
    });
  };

  public getRef = node => {
    this.decoratorForm = node;
  };

  public render() {
    const DecoratorForm = this.DecoratorForm;
    return (
      <DecoratorForm
        ref={this.getRef}
        {..._.omit(this.props, Form.createOptionsFields)}
        eventBus={this.eventBus}
      />
    );
  }
}

export default Form;
