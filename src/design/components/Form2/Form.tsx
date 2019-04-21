import { Form as AntdForm } from 'antd';
import { FormCreateOption } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import _ from 'lodash';
import React, { ComponentClass, PureComponent } from 'react';
import { createEventBus } from '../../utils';
import { VALIDATE_MESSAGES } from '../constants';
import { IFormBaseProps, IFormField, IFormProps, IFormTriggerCellValueChangeParams } from '../type';
import { FORM_CELL_VALUES_CHANGE } from './constants';
import FormBase from './FormBase';

class Form extends PureComponent<IFormProps & FormCreateOption<IFormProps>> {
  public static createOptionsFields = ['mapPropsToFields', 'validateMessages', 'withRef', 'name'];

  public static isField = (field: any) => {
    if (typeof field === 'object' && field !== null) {
      return field.type && field.type === 'field';
    }
    return false;
  };

  public static createField = (value: any) => {
    return {
      type: 'field',
      value,
    };
  };

  public static createFields = (data: any) => {
    return _.mapValues(data, val => Form.createField(val));
  };

  public static getFieldValue = (field: any) => {
    if (Form.isField(field)) {
      return _.get(field, 'value');
    }
    return field;
  };

  public static getFieldsValue = (fields: any) => {
    return _.mapValues(fields, val => Form.getFieldValue(val));
  };

  public static fieldIsEffective = (field: any) => {
    return field && !_.get(field, 'validating') && !_.get(field, 'errors');
  };

  public DecoratorForm: ComponentClass<IFormBaseProps>;

  public decoratorForm: WrappedFormUtils;

  public eventBus = createEventBus();

  public wrappedComponentRef: FormBase;

  constructor(props) {
    super(props);
    this.DecoratorForm = AntdForm.create<IFormBaseProps>({
      validateMessages: VALIDATE_MESSAGES,
      ..._.pick(props, Form.createOptionsFields),
      onFieldsChange: this.onFieldsChange,
      onValuesChange: this.onValuesChange,
      mapPropsToFields:
        props.dataSource &&
        (props => {
          const { dataSource } = props;
          const filledDataSource = props.columns.reduce((data, next) => {
            data[next.dataIndex] = dataSource[next.dataIndex];
            return data;
          }, {});
          const result = _.mapValues(
            _.pickBy(filledDataSource, (val: IFormField) => {
              return typeof val === 'object' && val.type === 'field';
            }),
            (val: IFormField) => {
              return AntdForm.createFormField(val);
            }
          );
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

  public onFieldsChange = (
    props: IFormProps & FormCreateOption<IFormProps>,
    fields: object,
    allFields: any,
    add: string
  ) => {
    const { onFieldsChange } = props;
    if (onFieldsChange) {
      onFieldsChange(
        props,
        _.mapValues(fields, (val: IFormField) => ({ ...val, type: 'field' })),
        _.mapValues(allFields, (val: IFormField) => ({ ...val, type: 'field' })),
        add
      );
    }
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
