import { Form as AntdForm } from 'antd';
import { FormCreateOption } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import _ from 'lodash';
import React, { ComponentClass, PureComponent } from 'react';
import { createEventBus } from '../../utils';
import { IFormBaseProps, IFormProps, IFormTriggerCellValueChangeParams, IFormField } from '../type';
import { FORM_CELL_VALUES_CHANGE } from './constants';
import FormBase from './FormBase';

class Form extends PureComponent<IFormProps & FormCreateOption<IFormProps>> {
  public static createOptionsFields = [
    'onFieldsChange',
    'mapPropsToFields',
    'validateMessages',
    'withRef',
    'name',
  ];

  public DecoratorForm: ComponentClass<IFormBaseProps>;

  public decoratorForm: WrappedFormUtils;

  public eventBus = createEventBus();

  public wrappedComponentRef: FormBase;

  constructor(props) {
    super(props);
    this.DecoratorForm = AntdForm.create<IFormBaseProps>({
      ..._.pick(props, Form.createOptionsFields),
      onValuesChange: this.onValuesChange,
      mapPropsToFields:
        props.dataSource &&
        (props => {
          const { dataSource } = props;
          if (!dataSource) return null;
          const filledDataSource = props.columns.reduce((data, next) => {
            data[next.dataIndex] = dataSource[next.dataIndex];
            return data;
          }, {});
          const result = _.mapValues(filledDataSource, (val: IFormField) => {
            return AntdForm.createFormField(val);
          });
          return result;
        }),
    })(FormBase);
  }

  public onValuesChange = (
    props: IFormProps & FormCreateOption<IFormProps>,
    changedValues,
    allValues
  ) => {
    const { dataSource: record = {}, onValuesChange } = props;
    if (onValuesChange) {
      onValuesChange(props, changedValues, allValues);
    }
    const event: IFormTriggerCellValueChangeParams = {
      changedValues,
      allValues,
      record,
    };
    this.eventBus.emit(FORM_CELL_VALUES_CHANGE, event);
  };

  public validate = async (
    options = {},
    fieldNames = this.props.columns.map(item => item.dataIndex)
  ) => {
    return this.wrappedComponentRef.validate(options, fieldNames);
  };

  public getRef = node => {
    this.decoratorForm = node;
  };

  public getWrappedComponentRef = node => {
    this.wrappedComponentRef = node;
    if (this.props.wrappedComponentRef) {
      this.props.wrappedComponentRef(node);
    }
  };

  public render() {
    const DecoratorForm = this.DecoratorForm;
    return (
      <DecoratorForm
        ref={this.getRef}
        {..._.omit(this.props, Form.createOptionsFields)}
        eventBus={this.eventBus}
        wrappedComponentRef={this.getWrappedComponentRef}
      />
    );
  }
}

export default Form;
